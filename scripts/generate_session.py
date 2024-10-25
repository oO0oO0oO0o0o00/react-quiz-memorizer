from collections import defaultdict
from dataclasses import dataclass
from random import Random

from scripts.commons import Article, QuizItem, QuizKind


@dataclass
class GenerateOptions:
    preferredDensityPerChars: float
    allowWeakSegmentation: bool
    quizKindWeights: dict[QuizKind: float] # WIP
    randomSeed: int = 0

def generateQuizArticle(article: Article, options: GenerateOptions):
    rng = Random(options.randomSeed)
    targetNumQuizzes = len(article.text) * options.preferredDensityPerChars
    quizzes = [q for q in article.quizzes]
    rng.shuffle(quizzes)
    excluded_ids: set[str] = set()
    link_id_to_quizzes: dict[str, list[int]] = defaultdict(list)
    picked_quizzes: list[QuizItem] = []
    for index, quiz in enumerate(quizzes):
        if quiz.link_id:
            link_id_to_quizzes[quiz.link_id].append(index)
    link_id_to_quizzes = dict(link_id_to_quizzes)
    for index, quiz in enumerate(quizzes):
        if quiz.exclusive_id in excluded_ids: continue
        picked_quizzes += link_id_to_quizzes.get(quiz.link_id, [quiz])
        if len(picked_quizzes) >= targetNumQuizzes: break
    result_quizzes: list[QuizItem] = []
    for quiz in picked_quizzes:
        kinds = quiz.only_kinds or list(QuizKind)
        default_weight = options.quizKindPortions
        rng.choices(kinds, )
