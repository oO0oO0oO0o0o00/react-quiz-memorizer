import { FillingQuizView } from "./filling-quiz-view";
import { SelectionQuizView } from "./selection-quiz-view";

export default function ArticleContent({ article, elRefs }) {
  const children = article.content.map((p, i) => (
    <p key={`p-${i}`}>
      {p.flatMap((e) => {
        switch (e.kind) {
          case "text":
            return e.text;
          case "quiz":
            const index = e.index;
            const quiz = article.quizzes[index];
            let Clazz;
            switch (quiz.kind) {
              case "filling":
                Clazz = FillingQuizView;
                break;
              case "selection":
              case "ordering":
                Clazz = SelectionQuizView;
                break;
              default:
                return <span className="error">Unknown Quiz</span>;
            }
            return [
              " ",
              <Clazz
                active={article.currentIndex === index}
                holder={article.quizHolderAt(index)}
                onFocused={() => article.setCurrentIndex(index)}
                key={`quiz-${index}`}
                innerRef={(x) => elRefs.current[index] = x}
              />,
              " ",
            ];
        }
      })}
    </p>
  ));
  return <>{children}</>
}