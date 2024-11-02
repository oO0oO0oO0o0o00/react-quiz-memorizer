from collections import defaultdict
from dataclasses import dataclass, field
from random import Random
from typing import Optional, Union
from commons import Article, QuizItem, QuizKind, WordsBase


@dataclass
class GenerateOptions:
    preferred_density_per_chars: float
    allow_weak_segmentation: bool = True
    quiz_kind_weights: dict[QuizKind: float] = field(default_factory=lambda: {})
    random_seed: int = 0


@dataclass
class _QuizModel:
    kind: str
    answers: list[list[int]]
    entries: list[str]


def generateQuizArticle(
        article: Article,
        options: GenerateOptions,
        wordsBase: WordsBase) -> dict:
    rng = Random(options.random_seed)
    # Pick quizzes
    targetNumQuizzes = len(article.text) * options.preferred_density_per_chars
    quizzes = [q for q in article.quizzes]
    rng.shuffle(quizzes)
    excluded_ids: set[str] = set()
    link_id_to_quizzes: dict[Optional[str], list[int]] = defaultdict(list)
    picked_quizzes: list[tuple[QuizItem, QuizKind]] = []
    for index, quiz in enumerate(quizzes):
        if quiz.link_id:
            link_id_to_quizzes[quiz.link_id].append(index)
    link_id_to_quizzes = dict(link_id_to_quizzes)
    for index, quiz in enumerate(quizzes):
        if quiz.exclusive_id in excluded_ids: continue
        for i in link_id_to_quizzes.get(quiz.link_id, [index]):
            linked = quizzes[i]
            kind = _assign_kind(linked, options.quiz_kind_weights, rng)
            if kind is None: continue
            picked_quizzes.append((linked, kind))
            if linked.exclusive_id is not None:
                excluded_ids.add(quiz.exclusive_id)
        if len(picked_quizzes) >= targetNumQuizzes: break
    picked_quizzes.sort(key = lambda x: x[0].text_start)
    # Validate quizzes
    validate_offset = 0
    for (quiz, _) in picked_quizzes:
        assert quiz.text_start >= validate_offset, \
            f"Overlapped quiz {quiz} at {validate_offset}!"
        assert quiz.text_end >= quiz.text_start
        validate_offset = quiz.text_end
    # Populate quizzes
    result_quizzes: list[QuizItem] = []
    template = ""
    template_offset = 0
    for (quiz, quiz_kind) in picked_quizzes:
        assert quiz.text_start >= template_offset
        template += article.text[template_offset : quiz.text_start]
        template += "${" + article.text[quiz.text_start : quiz.text_end] + "}"
        template_offset = quiz.text_end
        if quiz_kind == QuizKind.filling:
            answers = [list(range(len(quiz.segments)))] + quiz.alternative_answers
            result_quiz = _QuizModel(
                "filling", answers, [x.content for x in quiz.segments])
        elif quiz_kind == QuizKind.ordering:
            segments = [quiz.segments[0].text()]
            for segment in quiz.segments[1:]:
                if segment.separator_level > 0 and \
                    not options.allow_weak_segmentation:
                    segments[-1] += segment.text()
                else:
                    segments.append(segment.text())
            words = wordsBase.randomWords(
                count = min(max(len(segments) * 2 // 3, 2), 4),
                rng = rng,
                excludes=set(segments))
            entries, answers = _shuffle(segments, words, rng, quiz.alternative_answers)
            result_quiz = _QuizModel(
                "ordering", answers, entries)
        else:
            phrase = [quiz.text()]
            phrases = wordsBase.randomPhrases(
                count = 3, rng = rng, excludes = set(phrase))
            entries, answers = _shuffle(phrase, phrases, rng)
            result_quiz = _QuizModel(
                "selection", answers, entries)
        result_quizzes.append(result_quiz)
    template += article.text[template_offset:]
    return {
        "title": article.title,
        "text": template,
        "quizzes": [q.__dict__ for q in result_quizzes],    
    }


def _assign_kind(
        quiz: QuizItem,
        configured_weights: dict[QuizKind, float],
        rng: Random) -> Optional[QuizKind]:
    kinds = quiz.only_kinds or list(QuizKind)
    if len(quiz.segments) == 1:
        try:
            kinds.remove(QuizKind.ordering)
        except:
            pass
    default_weight = 1. if len(configured_weights) == 0 else 0.0
    weights = [
        configured_weights.get(k, default_weight)
        for k in kinds
    ]
    if sum(weights) <= 0.: return None
    return rng.choices(kinds, weights, k=1)[0]


def _shuffle(
        answers: list[str],
        maggots: list[str],
        rng: Random,
        alternatives: list[list[int]] = [],
    ) -> tuple[list[str], list[list[int]]]:
    seq = answers + maggots
    handles = list(range(len(seq)))
    rng.shuffle(handles)
    lookup = {
        j: i for i, j in enumerate(handles)
        if j < len(answers)
    }
    answer = [lookup[i] for i in range(len(answers))]
    alt_answers = [
        [answer[i] if isinstance(i, int) else i for i in alt]
        for alt in alternatives
    ]
    return (
        [seq[i] for i in handles],
        [answer] + alt_answers)
