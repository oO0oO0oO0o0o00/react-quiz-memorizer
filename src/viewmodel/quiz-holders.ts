import _ from 'underscore';
import { Quiz, QuizKind } from '../model/collection';
import { textMatches } from '../model/text-matchers';

export enum QuizStatus {
  none,
  wrong,
  right,
  taught,
  final,
}

export abstract class QuizState<T> {
  status: QuizStatus;
  value: T;
  score: boolean | null;
  
  constructor() {
    this.status = QuizStatus.none;
    this.value = this.initialValue;
    this.score = null;
  }

  get initialValue(): T {
    return (this.constructor as any).initialValue;
  }

  static create(quiz: Quiz): QuizState<any> {
    switch (quiz.kind) {
      case QuizKind.filling:
        return new FillingQuizState();
      case QuizKind.selection:
      case QuizKind.ordering:
        return new SelectionQuizState();
    }
  }
}

export class FillingQuizState extends QuizState<string> {
  static get initialValue() { return "" }
}

export class SelectionQuizState extends QuizState<number[]> {
  static get initialValue() { return [] }
}

type QuizSetStateArgs<T> = Partial<{
  value: T;
  status: QuizStatus;
}>

export abstract class QuizHolder<T> {
  quiz: Quiz;
  state: QuizState<T>;
  setState: (args: QuizSetStateArgs<T>) => void
  _goNext: () => void;
  pinyinMap: Record<string, string[]>;

  constructor(
    quiz: Quiz,
    state: QuizState<T>,
    setState: (args: QuizSetStateArgs<T>) => void,
    goNext: () => void,
    pinyinMap: Record<string, string[]>,
  ) {
    this.quiz = quiz;
    this.state = state;
    this.pinyinMap = pinyinMap;
    this.setState = setState;
    this._goNext = goNext;
  }

  static create(
    quiz: Quiz,
    state: QuizState<any>,
    setState: (args: QuizSetStateArgs<any>) => void = () => undefined,
    goNext: () => void = () => undefined,
    pinyinMap: Record<string, string[]> = {},
  ): QuizHolder<any> {
    switch (quiz.kind) {
      case QuizKind.filling:
        return new FillingQuizHolder(quiz, state, setState, goNext, pinyinMap);
      case QuizKind.selection:
        return new SelectionQuizHolder(quiz, state, setState, goNext, pinyinMap);
      case QuizKind.ordering:
        return new OrderingQuizHolder(quiz, state, setState, goNext, pinyinMap);
    }
  }

  judge(): boolean {
    const result = this.isCorrect();
    this.setState({ 
      status: result ? QuizStatus.right : QuizStatus.wrong,
      value: result ? this.standardAnswer : undefined,
    })
    return result;
  }

  abstract isCorrect(): boolean;

  abstract get shouldClearOnReset(): boolean;

  abstract get standardAnswer(): T;

  reset() {
    this.setState({ 
      value: this.shouldClearOnReset ? this.state.initialValue : undefined,
      status: QuizStatus.none,
    });
  }

  showAnswer() {
    this.setState({ 
      value: this.standardAnswer,
      status: QuizStatus.taught,
    })
  }

  goNext() {
    this.setState({ status: QuizStatus.final });
    this._goNext();
  }
}

export class FillingQuizHolder extends QuizHolder<string> {
  isCorrect() {
    const value = this.state.value;
    return textMatches(this.quiz, value, this.pinyinMap);
  }

  get shouldClearOnReset() { return false; }

  get standardAnswer(): string {
    return (this.quiz.answers[0] as number[])
      .map((e) => this.quiz.entries[e])
      .join('').replaceAll('\\', '')
  }
}

export class SelectionQuizHolder extends QuizHolder<number[]> {
  isCorrect() {
    return _.isEqual(this.quiz.answers[0], this.state.value);
  }

  get shouldClearOnReset() { return true; }

  get standardAnswer(): number[] {
    return this.quiz.answers[0] as any;
  }

  handleSelectEntry(index: number) {
      this.setState({ value: [index] });
      this.judge();
  }
}

export class OrderingQuizHolder extends QuizHolder<number[]> {
  isCorrect() {
    const value = this.state.value;
    const maxIndex = Math.max(...this.quiz.answers[0] as any);
    return _.some(
      this.quiz.answers,
      answer => _.every(
        _.zip(answer, value),
        ([a, b]) => a == b || a == 'x' && b <= maxIndex));
  }

  get shouldClearOnReset() { return true; }
  
  get standardAnswer(): number[] {
    return this.quiz.answers[0] as any;
  }

  handleSelectEntry(index: number) {
    this.setState({
      value: [...this.state.value as any, index],
    });
  }

  handleBackspace() {
    if (this.state.value.length == 0) {
      return;
    }
    this.setState({
      value: this.state.value.slice(0, -1),
    });
  }

  isEntrySelected(index: number) {
    return (this.state.value as number[]).includes(index);
  }
}
