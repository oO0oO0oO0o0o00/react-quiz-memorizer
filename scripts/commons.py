from enum import StrEnum
from dataclasses import dataclass, field
from random import Random
import re
from typing import Optional, Union


class QuizKind(StrEnum):
    filling = "f"
    selection = "s"
    ordering = "o"


@dataclass
class QuizItemSegment:
    content: str
    separator_level: int

    def text(self) -> str:
        return self.content.replace("\\", '')


@dataclass
class QuizItem:
    segments: list[QuizItemSegment] = field(default_factory=lambda: [])
    exclusive_id: Union[None, str, int] = None
    link_id: Optional[str] = None
    only_kinds: list[QuizKind] = field(default_factory=lambda: [])
    text_start: int = 0
    text_end: int = 0
    alternative_answers: list[list[Union[str, int]]] = field(default_factory=lambda: [])

    def text(self) -> str:
        return ''.join(x.text() for x in self.segments)
    
    def textual_answer(self) -> str:
        return ''.join(x.content for x in self.segments)
    

@dataclass
class Article:
    title: str
    text: str
    quizzes: list[QuizItem]


# For minimal validation
class WordsBase:
    _allow_kinds = set([QuizKind.ordering, QuizKind.selection])

    def __init__(self, phrases: list[list[str]]):
        self.phrases = set(''.join(p) for p in phrases)
        self.words = set().union(*(
            [_strip(xx) for xx in x] for x in phrases if len(x) > 1))

    @staticmethod
    def from_articles(articles: list[Article]) -> 'WordsBase':
        return WordsBase(sum(([[
                s.text() for s in q.segments
            ] for q in a.quizzes
            if len(q.only_kinds) == 0 or \
                len(WordsBase._allow_kinds.intersection(q.only_kinds)) > 0
        ] for a in articles), []))
    
    def randomWords(
        self, count: int, rng: Random, excludes: set[str]
    ) -> list[str]:
        return _randomStrings(count, rng, self.words, excludes)
    
    def randomPhrases(
        self, count: int, rng: Random, excludes: set[str]
    ) -> list[str]:
        return _randomStrings(count, rng, self.phrases, excludes)
    

def _randomStrings(
    count: int, rng: Random, candidates: set[str], excludes: set[str]
) -> list[str]:
    refined = [x for x in candidates if x not in excludes]
    return rng.sample(refined, k = min(len(refined), count))
    
def _strip(text: str) -> str:
    # temp solution
    base_pattern = r"[，、,.的和 ]"
    return re.sub(
        base_pattern + '$', '', re.sub(
            '^' + base_pattern, '', text))
