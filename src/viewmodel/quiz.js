import _ from 'underscore';

export class QuizStatus {
  static none = 0;
  static wrong = false;
  static right = true;
  static taught = 233;
  static final = 1;
}

export class QuizState {
  constructor() {
    this.status = QuizStatus.none;
    this.value = this.constructor.initialValue;
    this.score = null;
  }

  static create(quiz) {
    switch (quiz.kind) {
      case "filling":
        return new FillingQuizState();
      case "selection":
      case "ordering":
        return new SelectionQuizState();
      default:
        return null;
    }
  }
}

export class FillingQuizState extends QuizState {
  static get initialValue() { return "" }
}

export class SelectionQuizState extends QuizState {
  static get initialValue() { return [] }
}

export class QuizHolder {
  constructor(quiz, state, setState, goNext) {
    this.quiz = quiz;
    this.state = state;
    this.setState = setState;
    this._goNext = goNext;
  }

  static create(quiz, state, setState, goNext) {
    switch (quiz.kind) {
      case "filling":
        return new FillingQuizHolder(quiz, state, setState, goNext);
      case "selection":
        return new SelectionQuizHolder(quiz, state, setState, goNext);
      case "ordering":
        return new OrderingQuizHolder(quiz, state, setState, goNext);
      default:
        return null;
    }
  }

  judge() {
    const result = _.some(
      this.quiz.answers,
      answer => _.isEqual(this.state.value, answer));
    this.setState({ status: result })
    return result;
  }

  isCorrect() { return false; }

  reset() {
    this.setState({ 
      value: this.state.constructor.initialValue,
      status: QuizStatus.none,
    })
  }

  showAnswer() {
    this.setState({ 
      value: this.quiz.answers[0],
      status: QuizStatus.taught,
    })
  }

  goNext() {
    this.setState({ status: QuizStatus.final });
    this._goNext();
  }
}

export class FillingQuizHolder extends QuizHolder {
  constructor(quiz, state, setState, goNext) {
    super(quiz, state, setState, goNext);
  }

  isCorrect() { return false; }
}

export class SelectionQuizHolder extends QuizHolder {
  constructor(quiz, state, setState, goNext) {
    super(quiz, state, setState, goNext);
  }

  handleSelectEntry(index) {
      this.setState({ value: [index] });
      this.judge();
  }
}

export class OrderingQuizHolder extends QuizHolder {
  constructor(quiz, state, setState, goNext) {
    super(quiz, state, setState, goNext);
  }

  handleSelectEntry(index) {
    this.setState({ value: [...this.state.value, index] });
  }

  handleBackspace() {
    if (this.state.value.length == 0) {
      return;
    }
    this.setState({ value: this.state.value.slice(0, -1) });
  }

  isEntrySelected(index) {
    return this.state.value.includes(index);
  }
}
