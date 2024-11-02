import React from "react";
import _ from 'underscore';
import { QuizHolder, QuizState, QuizStatus } from "./quiz-holders"
import { Article } from "../model/collection";

interface ArticleState { 
  article: Article;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  quizStates: QuizState<any>[];
  setQuizStates: (states: QuizState<any>[]) => void;
  pinyinMap: Record<string, string[]>;
  progress: number;
  browsingProgress: number;
  loading: boolean;
}

export default class ArticleHolder {
  private _state: ArticleState;
  private _content: ArticleElement[][];

  constructor(state: ArticleState) {
    this._state = state;
    this._content = React.useMemo(
      () => contentOf(state.article), [state.article]);
  }

  get state() {
    return this._state;
  }

  get quizzes() {
    return this.state.article.quizzes;
  }

  get content() {
    return this._content;
  }

  get title() {
    return this.state.article.title;
  }

  get icon() {
    return this.state.article.icon;
  }

  get currentQuiz() {
    return this.state.article.quizzes[this.state.currentIndex];
  }

  get currentQuizState() {
    return this.state.quizStates[this.state.currentIndex];
  }

  quizHolderAt(index: number) {
    return QuizHolder.create(
      this.state.article.quizzes[index], // quiz
      this.state.quizStates[index], // state
      ({ value, status }) => { // setState
        let newQuizStates = [...this.state.quizStates];
        let state = newQuizStates[index];
        state.value = value ?? state.value;
        state.status = status ?? state.status;
        if (state.score == null) {
          if (status == QuizStatus.right) {
            state.score = true;
          } else if(status == QuizStatus.wrong) {
            state.score = false;
          }
        }
        this.state.setQuizStates(newQuizStates);
      },
      () => { // goNext
        this.state.setCurrentIndex(this.state.currentIndex + 1);
      }, this.state.pinyinMap,
    );
  }

  get currentQuizHolder() {
    return this.quizHolderAt(this.state.currentIndex);
  }

  skip() {
    this.state.setQuizStates(_.zip(
      this.state.article.quizzes,
      this.state.quizStates,
      Array.from(this.state.quizStates.keys())
    ).map(([quiz, state, index]) => {
      if (this.state.currentIndex > index) { return state; }
      state.value = QuizHolder.create(quiz, state).standardAnswer;
      state.status = QuizStatus.final;
      return state;
    }));
    this.state.setCurrentIndex(this.state.quizStates.length);
  }
}

export interface ArticleElementQuiz {
  index: number;
  name: string;
}

export type ArticleElement = ArticleElementQuiz | string;

enum ParsingState {
  text, escaping, initial, var
}

function contentOf(article: Article): ArticleElement[][] {
  if (!article) { return []; }
  let paragraphs: ArticleElement[][] = [];
  let paragraph: ArticleElement[] = [];
  let text = "";
  let varName = "";
  let varIndex = 0;
  let state = ParsingState.text;

  function endText() {
    if (state == ParsingState.escaping) {
      state = ParsingState.initial;
    }
    if (text == "") {
      return;
    }
    paragraph.push(text);
    text = "";
  }

  function endParagraph() {
    endText();
    varName = "";
    if (paragraph.length == 0) {
      return;
    }
    paragraphs.push(paragraph);
    paragraph = [];
  }

  for (let ch of article.text) {
    if (ch == "\n") {
      endParagraph();
      continue;
    }
    switch (state) {
      case ParsingState.text:
        if (ch == "$") {
          state = ParsingState.escaping;
        } else {
          text += ch;
        }
        break;
      case ParsingState.escaping:
        if (ch == "$") {
          state = ParsingState.initial;
          text += "$$";
        } else if (ch == "{") {
          state = ParsingState.var;
          endText();
        } else {
          text += "ch";
        }
        break;
      case ParsingState.var:
        if (ch == "}") {
          state = ParsingState.text;
          paragraph.push({ index: varIndex, name: varName});
          varIndex += 1;
          varName = "";
        } else {
          varName += ch;
        }
        break;
    }
  }
  endParagraph();
  return paragraphs;
}
