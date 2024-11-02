import React from "react";
import QuizPage from "./quiz-page";
import QuizNavigationHolder from "../viewmodel/quiz-navigation"
import U from "../utils";
import FinishPage from "./finish-page";
import { useCollectionHolder } from "../viewmodel/collection-holder";
import LoadingView from "./loading-view";

export default function QuizCollectionPage({ id, initialCollection }) {
  const holder = useCollectionHolder(id, initialCollection);

  if (!holder.state || holder.state.page < holder.state.totalPage && !holder.state.collection[holder.state.page]) {
    return <LoadingView/>
  } else if (holder.state.page >= holder.state.totalPage) {
    return <FinishPage score={holder.score} totalScore={holder.totalScore}/>;
  }
  const navigation = new QuizNavigationHolder({
    hasNext: holder.state.page < holder.state.progressPage,
    hasPrev: holder.state.page > 0,
    goNext: () => holder.switchPage(holder.state.page + 1),
    goPrev: () => holder.switchPage(holder.state.page - 1),
  });
  return <QuizPage fetchArticle={() => holder.articleHolder} navigation={navigation} />
}