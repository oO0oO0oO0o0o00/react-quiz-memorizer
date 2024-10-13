import { MantineProvider } from "@mantine/core";
const example = require("../src/data/example.json");
import QuizCollectionPage from "../src/view/quiz-collection-page";

export default function Page() {
  return <QuizCollectionPage collection={example}/>
}
 