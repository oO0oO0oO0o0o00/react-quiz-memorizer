from typing import Optional
from enum import StrEnum, auto
from dataclasses import dataclass, field
from antlr4 import CommonTokenStream, FileStream, InputStream, ParserRuleContext, TerminalNode
from MarkupLexer import MarkupLexer
from MarkupParser import MarkupParser
from scripts.commons import Article, QuizItem, QuizItemSegment, QuizKind

def _parseLine(text: str) -> MarkupParser.TemplateContext:
    input_stream = InputStream(text)
    lexer = MarkupLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = MarkupParser(stream)
    tree = parser.line()
    assert tree.getChildCount() == 2
    child = tree.getChild(0)
    assert isinstance(child, MarkupParser.TemplateContext)
    return child


@dataclass
class _RelationId:
    @property
    def id(self) -> str:
        pass

    def __eq__(self, value: object) -> bool:
        if isinstance(value, _RelationId):
            return self.id == value.id
        elif isinstance(value, str):
            return self.id == value
        else:
            return value == self
        
    def text(self) -> str:
        return str(self.id)


@dataclass
class _NamedRelationId(_RelationId):
    name: str

    @property
    def id(self) -> str:
        return self.name


@dataclass
class _AutoRelationId(_RelationId):
    @property
    def id(self) -> str:
        return id(self)


@dataclass
class _QuizItem:
    segments: list[str] = field(default_factory=lambda: [])
    exclusive_id: Optional[_RelationId] = None
    link_id: Optional[_RelationId] = None
    only_kinds: list[QuizKind] = field(default_factory=lambda: [])
    text_start: int = 0
    text_end: int = 0

    def text(self) -> str:
        return ''.join(self.segments)
    
    def to_final_form(self) -> QuizItem:
        return QuizItem(
            self.segments,
            None if self.exclusive_id is None else self.exclusive_id.text(),
            None if self.link_id is None else self.link_id.text(),
            self.only_kinds,
            self.text_start,
            self.text_end)


@dataclass
class _LineVisitState:
    text: str = ""
    quizzes: list[_QuizItem] = field(default_factory=lambda: [])


def _handleTemplate(node: MarkupParser.TemplateContext, state: _LineVisitState) -> list[str]:
    result: list[QuizItemSegment] = []
    sep_count = 0
    for child in node.getChildren():
        if isinstance(child, MarkupParser.TextContext):
            text = child.getText()
            state.text += text
            result.append(QuizItemSegment(text, 1 if sep_count > 1 else 0))
            sep_count = 0
        elif isinstance(child, MarkupParser.PlaceholderContext):
            result += _handlePlaceholder(child, state)
        elif isinstance(child, MarkupParser.SepContext):
            sep_count += 1
    return result


def _handlePlaceholder(node: MarkupParser.PlaceholderContext, state: _LineVisitState) -> list[str]:
    ch_count = node.getChildCount()
    assert ch_count >= 3 # `[`, at least 1 actual child, then `]`
    quiz = _QuizItem()
    quiz.text_start = len(state.text)
    state.quizzes.append(quiz)
    quizzes_offset = len(state.quizzes)
    for index, child in enumerate(node.getChildren()):
        if index == 0 or index >= ch_count - 1: continue
        if isinstance(child, MarkupParser.Ctrl_seqContext):
            ctrl = child
            ctrl_ch_count = ctrl.getChildCount()
            assert ctrl_ch_count in [3, 4]
            ctrl_kind_node = ctrl.getChild(1)
            assert isinstance(ctrl_kind_node, TerminalNode)
            ctrl_kind = ctrl_kind_node.getText()
            ctrl_content_node = None
            if ctrl_ch_count == 4:
                ctrl_content_node = ctrl.getChild(2)
            assert isinstance(ctrl_content_node, TerminalNode) # currently all ctrl req content
            ctrl_content = ctrl_content_node.getText()
            if ctrl_kind == "m":
                quiz.exclusive_id = _NamedRelationId(ctrl_content)
            elif ctrl_kind == "l":
                quiz.link_id = int(ctrl_content)
            elif ctrl_kind == "k":
                quiz.only_kinds = [QuizKind(x) for x in ctrl_content]
            else:
                raise RuntimeError(
                    f"Unrecognized ctrl sequence {ctrl_kind} with content {ctrl_content}")
        elif isinstance(child, MarkupParser.TemplateContext):
            quiz.segments += _handleTemplate(child, state)
        else:
            raise RuntimeError(
                f"Unrecognized token in placeholder: {child} ({type(child)})")
    quiz.text_end = len(state.text)
    children_quizzes = state.quizzes[quizzes_offset:]
    # Merge exclusive ids
    if len(children_quizzes) == 0: return quiz.segments
    children_named_exclusive_ids = set(
        x.exclusive_id for x in children_quizzes
        if isinstance(x.exclusive_id, _NamedRelationId))
    assert len(children_named_exclusive_ids) <= 1, \
        ("Exclusive groups of children placeholders conflict. " +
            f"placeholders are {[x.text() for x in children_quizzes]}.")
    assert (quiz.exclusive_id is None or
        len(children_named_exclusive_ids) == 0), \
        (f"Exclusive group of current quiz {quiz.text()}" +
            "conflict with children.")
    if isinstance(quiz.exclusive_id, _NamedRelationId):
        merged_exclusive_id = quiz.exclusive_id
    elif len(children_named_exclusive_ids) > 0:
        merged_exclusive_id = list(children_named_exclusive_ids)[0]
    else:
        merged_exclusive_id = _AutoRelationId()
    for quiz in [quiz] + [x for x in children_quizzes]:
        quiz.exclusive_id = merged_exclusive_id
    return quiz.segments


def parseLine(line: str) -> Article:
    state = _LineVisitState()
    _handleTemplate(_parseLine(line), state)
    return Article(
        "<Parsed Line>",
        state.text,
        [x.to_final_form() for x in state.quizzes])


def parseArticles(text: str) -> list[Article]:
    title: list[str] = []
    articles: list[Article] = []
    parsed_lines: list[_LineVisitState] = []

    def end_parsed_lines():
        if len(parsed_lines) == 0: return
        article = Article('-'.join(title), '', [])
        articles.append(article)
        for index, line in enumerate(parsed_lines):
            article.text += line.text + '\n'
            for quiz in line.quizzes:
                quiz.text_start += index
                quiz.text_end += index
                article.quizzes.append(QuizItem(quiz))
        parsed_lines.clear()
        
    for index, line in enumerate(text.splitlines()):
        try:
            if line == '':
                continue
            elif line[:2] == '==':
                end_parsed_lines()
                title_lv, title_seg = int(line[2:3]) - 1, line[3:]
                assert len(title) >= title_lv, \
                    f"Cannot skip intermediate title lv (from {len(title)} to {title_lv})"
                title = title[:title_lv] + [title_seg]
            else:
                state = _LineVisitState()
                _handleTemplate(_parseLine(line), state)
                parsed_lines.append(state)
        except Exception as e:
            raise RuntimeError(
                f"Error occurred while parsing line {index + 1} ({line})") from e
    end_parsed_lines()
    return articles
