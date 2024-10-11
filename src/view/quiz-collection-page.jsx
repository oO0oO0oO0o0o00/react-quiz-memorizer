import React from "react";
import ArticleHolder from "../viewmodel/article";
import QuizPage from "./quiz-page";
import QuizNavigationHolder from "../viewmodel/quiz-navigation"
import { QuizState } from "../viewmodel/quiz";
import U from "../utils";
import FinishPage from "./finish-page";
import ScoreHolder from "../viewmodel/score-holder";
import CollectionHolder from "../viewmodel/collection-holder";

export default function QuizCollectionPage({ collection }) {
  const holder = new CollectionHolder({ collection });
  const scoreHolder = new ScoreHolder({
    score: holder.score,
    total: holder.totalScore,
    progress: holder.progress,
  });
  const article = new ArticleHolder({
    article: holder.currentArticle,
    currentIndex: holder.currentQuizIndex,
    setCurrentIndex: (i, s) => holder.setCurrentQuizIndex(i, s),
    quizStates: holder.currentPageState,
    setQuizStates: (s) => holder.setCurrentPageState(s),
    scoreHolder: scoreHolder,
  });
  if (holder.page >= holder.collection.length) {
    return <FinishPage scoreHolder={scoreHolder}/>;
  }
  const navigation = new QuizNavigationHolder({
    hasNext: holder.page < holder.progressPage,
    hasPrev: holder.page > 0,
    goNext: () => holder.switchPage(holder.page + 1),
    goPrev: () => holder.switchPage(holder.page - 1),
  });
  return <QuizPage article={article} navigation={navigation} />
}