import { FillingQuizHolder, OrderingQuizHolder, QuizHolder, SelectionQuizHolder } from "../viewmodel/quiz-holders";
import { FillingQuizOptionsBar, FillingQuizView } from "./filling-quiz-view";
import { QuizOptionsBarProps, QuizViewProps } from "./quiz-view";
import { OrderingQuizOptionsBar, SelectionQuizOptionsBar, SelectionQuizView } from "./selection-quiz-view";

export function QuizView(prop: QuizViewProps<any, QuizHolder<any>>) {
  if (prop.holder instanceof SelectionQuizHolder
    || prop.holder instanceof OrderingQuizHolder
  ) {
    return SelectionQuizView(prop as any);
  }
  if (prop.holder instanceof FillingQuizHolder) {
    return FillingQuizView(prop);
  }
  return <div>{`[Unknown quiz of kind "${prop.holder.quiz.kind}"]`}</div>
}

export function QuizOptionsBar(prop: QuizOptionsBarProps<any>) {
  if (prop.holder instanceof SelectionQuizHolder) {
    return SelectionQuizOptionsBar(prop);
  }
  if (prop.holder instanceof OrderingQuizHolder) {
    return OrderingQuizOptionsBar(prop);
  }
  if (prop.holder instanceof FillingQuizHolder) {
    return FillingQuizOptionsBar(prop);
  }
  return <div></div>
}
