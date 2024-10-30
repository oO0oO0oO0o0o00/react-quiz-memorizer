import React from "react";
import { Group, Image, Center, Button, Menu, Progress, rem, Title } from "@mantine/core";
import { IconArrowLeft, IconDots, IconChevronLeft, IconChevronRight, IconPlayerSkipForward } from "@tabler/icons-react";
import ArticleContent from "../view/article-content"
import { SelectionQuizOptionsBar, OrderingQuizOptionsBar } from "../view/selection-quiz-view"
import { QuizStatus } from "../viewmodel/quiz-holders";
import { MistakeOptionsBar, FinishedOptionsBar, NextPageOptionsBar } from "../view/finish-option-bars";
import { FillingQuizOptionsBar } from "./filling-quiz-view";
import U from "../utils";

export default function QuizPage({ fetchArticle, navigation }) {
  const article = fetchArticle();
  const elRefs = React.useRef([]);

  // Shrink DOM array
  React.useEffect(() => {
    elRefs.current = U.shrink(elRefs.current, article.quizzes.length);
  }, [article.quizzes?.length]);

  // Quiz & page switching
  React.useEffect(() => {
    if (article.currentIndex < article.quizzes.length) {
      focusQuiz(article.currentIndex);
    }
  }, [
    article,
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

  function handleSkip() {
    article.skip();
    navigation.goNext();
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
          case "ordering":
            Clazz = OrderingQuizOptionsBar;
            break;
          case "selection":
            Clazz = SelectionQuizOptionsBar;
            break;
          case "filling":
            Clazz = FillingQuizOptionsBar;
            break;
          default:
            return null;
        }
        break;
      default:
        return <NextPageOptionsBar onClick={() => navigation.goNext()} loading={article.loading}/>;
    }
    return <Clazz holder={article.currentQuizHolder} />;
  })();

  return (
    <>
      <header className="layer">
        <Group className="main" justify="space-between" h="100%">
          <IconArrowLeft stroke={1.2} />
          {/* <div>{article.title}</div> */}
          <Button className="lite" size="xs" variant="transparent" disabled={!navigation.hasPrev} onClick={() => navigation.goPrev()}>
            <IconChevronLeft size={20} stroke={1.5} />
          </Button>
          <Button className="lite" size="xs" variant="transparent" disabled={!navigation.hasNext} onClick={() => navigation.goNext()}>
            <IconChevronRight size={20} stroke={1.5} />
          </Button>
          <Menu width={150}>
            <Menu.Target>
              <Button className="lite" size="xs" variant="transparent">
                <IconDots stroke={1.2} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconPlayerSkipForward style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => handleSkip()}>
                Skip
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Progress size="xs" radius={null}
          value={article.progress * 100} />
      </header>
      <main>
        <Center>{article.title}</Center>
        {article.icon ? 
        <Center>
          <Image
            radius="md"
            h={{ base: 200, xs: 100 }}
            src={`/images/${article.icon}`}
            w="auto"
            fit="contain"
          />
        </Center> : null}
        <ArticleContent article={article} elRefs={elRefs} />
      </main>
      {optionsBar == null ? null : (
        <footer className="layer">{optionsBar}</footer>
      )}
    </>);
}
