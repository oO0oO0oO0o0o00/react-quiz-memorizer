import _ from 'underscore';

export class QuizStatus {
  static none = 0;
  static wrong = false;
  static right = true;
  static taught = 233;
}

export class QuizState {
  constructor() {
    this.status = QuizStatus.none;
    this.value = this.constructor.initalValue;
  }

  static create(quiz) {
    switch (quiz.kind) {
      case "fill":
        return new FillingQuizState();
      case "selection":
        return new SelectionQuizState();
      default:
        return null;
    }
  }
}

export class FillingQuizState extends QuizState {
  static get initalValue() { return "" }
}

export class SelectionQuizState extends QuizState {
  static get initalValue() { return [] }
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
      case "fill":
        return new FillingQuizHolder(quiz, state, setState, goNext);
      case "selection":
        return new SelectionQuizHolder(quiz, state, setState, goNext);
      default:
        return null;
    }
  }

  judge() {
    const result = _.isEqual(this.state.value, this.quiz.answer);
    this.setState({ status: result })
    return result;
  }

  reset() {
    this.setState({ 
      value: this.state.constructor.initalValue,
      status: QuizStatus.none,
    })
  }

  showAnswer() {
    this.setState({ 
      value: this.quiz.answer,
      status: QuizStatus.taught,
    })
  }

  goNext() {
    this.setState({ status: QuizStatus.none });
    this._goNext();
  }
}

export class FillingQuizHolder extends QuizHolder {
  constructor(quiz, state, setState, goNext) {
    super(quiz, state, setState, goNext);
  }
}

export class SelectionQuizHolder extends QuizHolder {
  constructor(quiz, state, setState, goNext) {
    super(quiz, state, setState, goNext);
  }

  handleSelectEntry(index) {
    let newState;
    switch (this.quiz.mode) {
      case "free-sort":
        newState = [...this.state.value, index];
        break;
      case "single-select":
        newState = [index];
    }
    this.setState({ value: newState });
  }

  handleBackspace() {
    if (this.state.value.length == 0) {
      return;
    }
    this.setState({ value: this.state.value.slice(0, -1) });
  }

  shouldDisableEntry(index) {
    switch (this.quiz.mode) {
      case "free-sort":
        return this.state.value.includes(index);
      default:
        return false;
    }
  }

  shouldHighlightEntry(index) {
    switch (this.quiz.mode) {
      case "single-select":
        return this.state.value.includes(index);
      default:
        return false;
    }
  }

  shouldShowActions() {
    return this.quiz.mode == "free-sort";
  }
}
