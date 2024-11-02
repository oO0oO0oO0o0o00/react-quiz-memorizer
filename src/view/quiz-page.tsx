import React from "react";
import { Group, Image, Center, Button, Menu, Progress, rem, Title, useMantineTheme } from "@mantine/core";
import { IconArrowLeft,
  IconDots,
  IconChevronLeft,
  IconChevronRight,
  IconPlayerSkipForward,
  IconRotate,
} from "@tabler/icons-react";
import ArticleContent from "./article-content"
import { QuizStatus } from "../viewmodel/quiz-holders";
import { MistakeOptionsBar, FinishedOptionsBar, NextPageOptionsBar } from "./finish-option-bars";
import U from "../utils";
import ArticleHolder from "../viewmodel/article";
import QuizNavigationHolder from "../viewmodel/quiz-navigation"
import { QuizOptionsBar } from "./quiz-view-dispatch";

interface QuizPageProp {
  fetchArticle: () => ArticleHolder;
  navigation: QuizNavigationHolder;
}

export default function QuizPage(
  { fetchArticle, navigation }: QuizPageProp
) {
  const article = fetchArticle();
  const elRefs = React.useRef<HTMLElement[]>([]);
  const theme = useMantineTheme();

  // Shrink DOM array
  React.useEffect(() => {
    elRefs.current = U.shrink(elRefs.current, article.quizzes.length);
  }, [article.quizzes?.length]);

  // Quiz auto focus
  React.useEffect(() => {
    if (article.state.currentIndex < article.quizzes.length) {
      focusQuiz(article.state.currentIndex);
    }
  }, [
    article,
    article.state.currentIndex,
    article.state.quizStates[article.state.currentIndex]?.status,
  ]);

  function focusQuiz(index: number) {
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

  function handleResetQuiz() {
    article.currentQuiz;
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
        return <QuizOptionsBar holder={article.currentQuizHolder}/>
      default:
        return <NextPageOptionsBar
          onClick={() => navigation.goNext()}
          loading={article.state.loading}/>;
    }
    return <Clazz holder={article.currentQuizHolder} />;
  })();

  const menuIconStyle = { width: rem(14), height: rem(14) };
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
                key="skip"
                leftSection={<IconPlayerSkipForward style={menuIconStyle} />}
                onClick={() => handleSkip()}>
                跳过此页
              </Menu.Item>
              {U.isDev ? [
                <Menu.Item
                  key="reset-quiz"
                  leftSection={<IconRotate style={menuIconStyle} />}
                  onClick={() => handleResetQuiz()}>
                  重置题目
                </Menu.Item>
              ] : []}
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Progress.Root size="xs" radius="sm">
          <Progress.Section
            value={article.state.browsingProgress * 100}
            color={theme.primaryColor}/>
          <Progress.Section
            value={(article.state.progress - article.state.browsingProgress) * 100}
            color={theme.colors.oranges[1]}/>
        </Progress.Root>
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
