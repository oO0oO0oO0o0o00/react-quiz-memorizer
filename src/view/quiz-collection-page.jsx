import React from "react";
import ArticleHolder from "../viewmodel/article";
import QuizPage from "./quiz-page";
import QuizNavigationHolder from "../viewmodel/quiz-navigation"
import U from "../utils";
import FinishPage from "./finish-page";
import CollectionHolder from "../viewmodel/collection-holder";

export default function QuizCollectionPage({ collection }) {
  const holder = new CollectionHolder({
    id: "example",
    collection,
    numPages: collection.length,
  });
  if (holder.page >= holder.collection.length) {
    return <FinishPage score={holder.score} totalScore={holder.totalScore}/>;
  }
  const navigation = new QuizNavigationHolder({
    hasNext: holder.page < holder.progressPage,
    hasPrev: holder.page > 0,
    goNext: () => holder.switchPage(holder.page + 1),
    goPrev: () => holder.switchPage(holder.page - 1),
  });
  return <QuizPage createArticle={() => holder.articleHolder} navigation={navigation} />
}