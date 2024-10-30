import React from "react";
import _ from 'underscore';
import { QuizHolder, QuizState, QuizStatus } from "./quiz-holders"

export default class ArticleHolder {
  constructor({ 
    article,
    currentIndex,
    setCurrentIndex,
    quizStates,
    setQuizStates,
    progress,
    loading,
  }) {
    this._article = article;
    this._content = React.useMemo(
      () => contentOf(article), [article]);
    this.currentIndex = currentIndex;
    this.setCurrentIndex = setCurrentIndex;
    this.quizStates = quizStates;
    this._setQuizStates = setQuizStates;
    this.progress = progress;
    this.loading = loading;
  }

  get quizzes() {
    return this._article.quizzes;
  }

  get content() {
    return this._content;
  }

  get title() {
    return this._article.title;
  }

  get icon() {
    return this._article.icon;
  }

  get currentQuiz() {
    return this._article.quizzes[this.currentIndex];
  }

  get currentQuizState() {
    return this.quizStates[this.currentIndex];
  }

  quizHolderAt(index) {
    return QuizHolder.create(
      this._article.quizzes[index], // quiz
      this.quizStates[index], // state
      ({ value, status }) => { // setState
        let newQuizStates = [...this.quizStates];
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
        this._setQuizStates(newQuizStates);
      },
      () => { // goNext
        this.setCurrentIndex(this.currentIndex + 1);
      }
    );
  }

  get currentQuizHolder() {
    return this.quizHolderAt(this.currentIndex);
  }

  skip() {
    this._setQuizStates(_.zip(
      this._article.quizzes,
      this.quizStates,
      Array.from(this.quizStates.keys())
    ).map(([quiz, state, index]) => {
      if (this.currentIndex > index) { return state; }
      state.value = quiz.answers[0];
      state.status = QuizStatus.final;
      return state;
    }));
    this.setCurrentIndex(this.quizStates.length);
  }
}

function contentOf(article) {
  if (!article) { return null; }
  let paragraphs = [];
  let paragraph = [];
  let text = "";
  let varName = "";
  let varIndex = 0;
  let state = "text";

  function endText() {
    if (state == "escaping") {
      state = "initial";
    }
    if (text == "") {
      return;
    }
    paragraph.push({ kind: "text", text });
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
      case "text":
        if (ch == "$") {
          state = "escaping";
        } else {
          text += ch;
        }
        break;
      case "escaping":
        if (ch == "$") {
          state = "initial";
          text += "$$";
        } else if (ch == "{") {
          state = "var";
          endText();
        } else {
          text += "ch";
        }
        break;
      case "var":
        if (ch == "}") {
          state = "text";
          paragraph.push({ kind: "quiz", index: varIndex, name: varName });
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
