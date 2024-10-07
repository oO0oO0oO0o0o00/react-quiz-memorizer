import React from "react";
import { Group, Image, Center } from "@mantine/core";
import { IconArrowLeft, IconDots } from "@tabler/icons-react";
import ArticleContent from "../view/article-content"
import { SelectionQuizOptionsBar } from "../view/selection-quiz-view"
import ArticleHolder from "../viewmodel/article";
import { QuizStatus } from "../viewmodel/quiz";
import { MistakeOptionsBar, FinishedOptionsBar } from "../view/finish-option-bars";
import { FillingQuizOptionsBar } from "./filling-quiz-view";
import U from "../utils";
const logo = require("../images/cat.jpg");

export default function QuizPage({ articleData, onFinish }) {
  const article = new ArticleHolder(articleData);
  const elRefs = React.useRef([]);

  React.useEffect(() => {
    elRefs.current = U.shrink(elRefs.current, article.quizes.length);
  }, [article.quizes.length]);

  React.useEffect(() => {
    if (article.currentIndex == article.quizes.length) {
      onFinish();
    } else {
      focusQuiz(article.currentIndex);
    }
  }, [
    article.currentIndex, 
    article.quizStates[article.currentIndex]?.status,
  ]);

  function focusQuiz(index) {
    const el = elRefs.current[index];
    if (el) {
      el.scrollIntoView();
      el.scrollIntoView({ block: "center" });
      el.focus();
    }
  }

  const optionsBar = (() => {
    let Clazz;
    switch (article.currentQuizState?.status) {
      case QuizStatus.wrong:
        Clazz = MistakeOptionsBar;
        break;
      case QuizStatus.right:
      case QuizStatus.taught:
        Clazz = FinishedOptionsBar;
        break;
      case QuizStatus.none:
        switch (article.currentQuiz?.kind) {
          case "selection":
            Clazz = SelectionQuizOptionsBar;
            break;
          case "fill":
            Clazz = FillingQuizOptionsBar;
            break;
          default:
            return null;
        }
        break;
      default:
        return null;
    }
    return (
      <Clazz holder={article.currentQuizHolder} />
    );
  })();

  return (
    <>
      <header className="layer">
        <Group justify="space-between" h="100%">
          <IconArrowLeft stroke={1.2} />
          <div>{article.title}</div>
          <IconDots stroke={1.2} />
        </Group>
      </header>
      <main>
        <Center>
          <Image
            radius="md"
            h={{ base: 200, xs: 100 }}
            src={String(logo)}
            w="auto"
            fit="contain"
          />
        </Center>
        <ArticleContent article={article} elRefs={elRefs} />
      </main>
      {optionsBar == null ? null : (
        <footer className="layer">{optionsBar}</footer>
      )}
    </>);
}
