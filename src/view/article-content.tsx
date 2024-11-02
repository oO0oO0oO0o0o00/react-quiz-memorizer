import ArticleHolder from "../viewmodel/article";
import { QuizView } from "./quiz-view-dispatch";

interface ArticleContentProps {
  article: ArticleHolder;
  elRefs: React.MutableRefObject<HTMLElement[]>;
}

export default function ArticleContent(
  { article, elRefs }: ArticleContentProps
) {
  const children = article.content.map((p, i) => (
    <p key={`p-${i}`}>
      {p.flatMap((e) => {
        if (typeof e === "string") {
          return e;
        }
        const index = e.index;
        return [
          " ",
          <QuizView
            active={article.state.currentIndex === index}
            holder={article.quizHolderAt(index)}
            onFocused={() => article.state.setCurrentIndex(index)}
            key={`quiz-${index}`}
            innerRef={(x) => elRefs.current[index] = x}
          />,
          " ",
        ];
      })}
    </p>
  ));
  return <>{children}</>
}
