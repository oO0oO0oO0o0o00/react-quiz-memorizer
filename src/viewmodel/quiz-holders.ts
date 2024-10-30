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

export abstract class QuizState {
  status: QuizStatus;
  value: string | number[];
  score: null;
  
  constructor() {
    this.status = QuizStatus.none;
    this.value = (this.constructor as any).initialValue;
    this.score = null;
  }

  get initialValue(): string | number[] {
    return (this.constructor as any).initialValue;
  }

  static create(quiz: Quiz): QuizState {
    switch (quiz.kind) {
      case QuizKind.filling:
        return new FillingQuizState();
      case QuizKind.selection:
      case QuizKind.ordering:
        return new SelectionQuizState();
    }
  }
}

export class FillingQuizState extends QuizState {
  static get initialValue() { return "" }
}

export class SelectionQuizState extends QuizState {
  static get initialValue() { return [] }
}

interface QuizSetStateArgs {
  value: string | number[] | null;
  status: QuizStatus | null;
}

export abstract class QuizHolder {
  quiz: Quiz;
  state: QuizState;
  setState: (args: QuizSetStateArgs) => void
  _goNext: () => void;

  constructor(
    quiz: Quiz,
    state: QuizState,
    setState: (args: QuizSetStateArgs) => void,
    goNext: () => void
  ) {
    this.quiz = quiz;
    this.state = state;
    this.setState = setState;
    this._goNext = goNext;
  }

  static create(
    quiz: Quiz,
    state: QuizState,
    setState: (args: QuizSetStateArgs) => void,
    goNext: () => void
  ): QuizHolder {
    switch (quiz.kind) {
      case QuizKind.filling:
        return new FillingQuizHolder(quiz, state, setState, goNext);
      case QuizKind.selection:
        return new SelectionQuizHolder(quiz, state, setState, goNext);
      case QuizKind.ordering:
        return new OrderingQuizHolder(quiz, state, setState, goNext);
    }
  }

  judge(): boolean {
    const result = this.isCorrect();
    this.setState({ 
      status: result ? QuizStatus.right : QuizStatus.wrong,
      value: result ? this.standardAnswer : null,
    })
    return result;
  }

  abstract isCorrect(): boolean;

  reset() {
    this.setState({ 
      value: this.state.initialValue,
      status: QuizStatus.none,
    })
  }

  showAnswer() {
    this.setState({ 
      value: this.standardAnswer,
      status: QuizStatus.taught,
    })
  }

  abstract get standardAnswer(): string | number[];

  goNext() {
    this.setState({ 
      status: QuizStatus.final,
      value: null,
    });
    this._goNext();
  }
}

export class FillingQuizHolder extends QuizHolder {
  isCorrect() {
    const value = this.state.value;
    if (typeof value != "string") {
      return false;
    }
    return textMatches(this.quiz, value);
  }

  get standardAnswer(): string {
    return (this.quiz.answers[0] as number[])
      .map((e) => this.quiz.entries[e])
      .join('').replaceAll('\\', '')
  }
}

export class SelectionQuizHolder extends QuizHolder {
  isCorrect() {
    return _.isEqual(this.quiz.answers[0], this.state.value);
  }

  get standardAnswer(): number[] {
    return this.quiz.answers[0] as any;
  }

  handleSelectEntry(index: number) {
      this.setState({
        value: [index],
        status: null,
      });
      this.judge();
  }
}

export class OrderingQuizHolder extends QuizHolder {
  isCorrect() {
    const value = this.state.value;
    if (!Array.isArray(value)) {
      return false;
    }
    const maxIndex = Math.max(...this.quiz.answers[0] as any);
    return _.some(
      this.quiz.answers,
      answer => _.every(
        _.zip(answer, value),
        ([a, b]) => a == b || a == 'x' && b <= maxIndex));
  }
  
  get standardAnswer(): number[] {
    return this.quiz.answers[0] as any;
  }

  handleSelectEntry(index: number) {
    this.setState({
      value: [...this.state.value as any, index],
      status: null,
    });
  }

  handleBackspace() {
    if (this.state.value.length == 0) {
      return;
    }
    this.setState({
      value: this.state.value.slice(0, -1),
      status: null,
    });
  }

  isEntrySelected(index: number) {
    return (this.state.value as number[]).includes(index);
  }
}
