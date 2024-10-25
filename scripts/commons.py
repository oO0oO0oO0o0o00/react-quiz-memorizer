from enum import StrEnum
from dataclasses import dataclass, field
from typing import Optional


class QuizKind(StrEnum):
    filling = "f"
    selection = "s"
    ordering = "o"

@dataclass
class QuizItemSegment:
    text: str
    separator_level: int

@dataclass
class QuizItem:
    segments: list[str] = field(default_factory=lambda: [])
    exclusive_id: Optional[str] = None
    link_id: Optional[str] = None
    only_kinds: list[QuizKind] = field(default_factory=lambda: [])
    text_start: int = 0
    text_end: int = 0
    def text(self) -> str:
        return ''.join(self.segments)
    def text(self) -> str:
        return ''.join(self.segments)
    
@dataclass
class Article:
    title: str
    text: str
    quizzes: list[QuizItem]
