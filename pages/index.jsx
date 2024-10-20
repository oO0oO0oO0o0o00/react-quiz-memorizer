import QuizCollectionPage from "../src/view/quiz-collection-page";
import { queryPages } from "./api/[id]/pages";

export async function getServerSideProps() {
  return { props: { initialCollection: await queryPages({
    id: "example", from: 0, to: 1
  }) } };
}

export default function Page({ initialCollection }) {
  return <QuizCollectionPage id="example" initialCollection={initialCollection} />
}
