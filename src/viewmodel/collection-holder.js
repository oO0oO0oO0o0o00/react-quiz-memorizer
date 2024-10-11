import React from "react";
import U from "../utils";
import { QuizState, QuizStatus } from "./quiz";

export default class CollectionHolder {
    constructor({
        collection
    }) {
        this.collection = collection;
        [this.progressPage, this._setProgressPage] = React.useState(0);
        [this.page, this._setPage] = React.useState(0);
        [this.quizIndexes, this._setQuizIndexes] = React.useState(
            () => Array(collection.length).fill(0));
        this.totalScore = React.useMemo(
          () => collection.reduce((s, e) => s + e.quizzes.length, 0),
          [collection]);
        [this.currentPageState, this._setCurrentPageState] = React.useState(
            () => collection[this.page].quizzes.map(QuizState.create));
        this.pageStates = React.useMemo(
            () => {
                const arr = Array(collection.length);
                arr[this.page] = this.currentPageState;
                return arr;
            }, [collection]);
        this.score = React.useMemo(() => {
            return this.pageStates.reduce((s, e) => {
                return s + (e?.reduce((s, e) => {
                    return s + (e?.score == true ? 1 : 0);
                }, 0) ?? 0);
            }, 0);
        }, [this.currentPageState]);
        this.progress = React.useMemo(() => {
            let x= this.pageStates.reduce((s, e) => {
                let y= s + (e?.reduce((s, e) => {
                    return s + (e?.status == QuizStatus.final ? 1 : 0);
                }, 0) ?? 0);
                console.log({y});
                return y;
            }, 0);
            console.log({x, s: JSON.stringify(this.pageStates)});
            return x;
        }, [this.currentPageState]);
    }
    
    _prepareQuizStates(selectedPage) {
        return this.collection[selectedPage ?? this.page].quizzes.map(QuizState.create);
    }

    setCurrentPageState(state) {
        this._setCurrentPageState(state);
        if (this.page <= this.collection.length) {
            this.pageStates[this.page] = state;
        }
    }
    
    switchPage(newPage) {
      this._setPage(newPage);
      this.pageStates[this.page] = this.currentPageState;
      if (newPage >= this.collection.length) {
        this._setCurrentPageState(null);
        return;
      }
      this._setCurrentPageState(this.pageStates[newPage] ?? this._prepareQuizStates(newPage));
      if (this.progressPage < newPage) {
        this._setProgressPage(newPage);
      }
    }

    get currentArticle() {
        return this.collection[this.page];
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
}