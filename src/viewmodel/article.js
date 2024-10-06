import React from "react";
import { QuizHolder, QuizState } from "./quiz"

export default class ArticleHolder {
  constructor(article) {
    this._article = article;
    this._content = contentOf(article);
    [this.currentIndex, this.setCurrentIndex] = React.useState(0);
    [this.quizStates, this._setQuizStates] = React.useState(
      article.quizes.map(QuizState.create));
  }

  get quizes() {
    return this._article.quizes;
  }

  get content() {
    return this._content;
  }

  get title() {
    return this._article.title;
  }

  get currentQuiz() {
    return this._article.quizes[this.currentIndex];
  }

  get currentQuizState() {
    return this.quizStates[this.currentIndex];
  }

  quizHolderAt(index) {
    return QuizHolder.create(
      this._article.quizes[index], // quiz
      this.quizStates[index], // state
      ({ value, status }) => { // setState
        let newQuizStates = [...this.quizStates];
        let state = newQuizStates[index];
        state.value = value ?? state.value;
        state.status = status ?? state.status;
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
}

function contentOf(article) {
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
