import React from "react";
import U from "../utils";
import { QuizState, QuizStatus } from "./quiz";
import ArticleHolder from "./article";

export default class CollectionHolder {
    constructor({
        id, collection, numPages,
    }) {
        this.collection = collection;
        this.numPages = numPages;
        [this.progressPage, this._setProgressPage] = React.useState(0);
        [this.page, this._setPage] = React.useState(0);
        [this.quizIndexes, this._setQuizIndexes] = React.useState(
            () => Array(numPages).fill(0));
            [this.currentPageState, this._setCurrentPageState] = React.useState(
                () => collection[this.page].quizzes.map(QuizState.create));
        this.pageStates = React.useMemo(
            () => {
                const arr = Array(numPages);
                arr[this.page] = this.currentPageState;
                return arr;
            }, [collection]);
        this.totalScore = React.useMemo(
          () => this.page == this.numPages ?
            this.pageStates.reduce((s, e) => s + e?.length ?? 0, 0) : 0,
          [id, this.page]);
        this.score = React.useMemo(() => {
            return this.pageStates.reduce((s, e) => {
                return s + (e?.reduce((s, e) => {
                    return s + (e?.score == true ? 1 : 0);
                }, 0) ?? 0);
            }, 0);
        }, [this.currentPageState]);
        this.progress = React.useMemo(() => {
            const pageWeight = 1 / numPages;
            const pageProgress = ((this.currentPageState?.length ?? 0) > 0) ?
                (this.currentPageState.reduce(
                    (s, e) => s + (e.status == QuizStatus.final ? 1 : 0), 0)
                    / this.currentPageState.length) : 0;
            return pageWeight * (this.progressPage + pageProgress);
        }, [this.currentPageState]);
    }
    
    _prepareQuizStates(selectedPage) {
        return this.collection[selectedPage ?? this.page].quizzes.map(QuizState.create);
    }

    setCurrentPageState(state) {
        this._setCurrentPageState(state);
        if (this.page <= this.numPages) {
            this.pageStates[this.page] = state;
        }
    }
    
    switchPage(newPage) {
      this._setPage(newPage);
      this.pageStates[this.page] = this.currentPageState;
      if (newPage >= this.numPages) {
        this._setCurrentPageState(null);
        return;
      }
      this._setCurrentPageState(this.pageStates[newPage] ?? this._prepareQuizStates(newPage));
      if (this.progressPage < newPage) {
        this._setProgressPage(newPage);
      }
    }

    get currentQuizIndex() {
        return this.quizIndexes[this.page];
    }

    setCurrentQuizIndex(index) {
        this._setQuizIndexes(
            U.mutateWithCopy(this.quizIndexes, this.page, index));
        if (index >= this.currentPageState.length) {
            this.switchPage(this.page + 1);
        }
    }

    get articleHolder() {
        return new ArticleHolder({
            article: this.collection[this.page],
            currentIndex: this.currentQuizIndex,
            setCurrentIndex: (i, s) => this.setCurrentQuizIndex(i, s),
            quizStates: this.currentPageState,
            setQuizStates: (s) => this.setCurrentPageState(s),
            progress: this.progress,
        });
    }
}
