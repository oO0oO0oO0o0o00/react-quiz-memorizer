import "@mantine/core/styles.css";
import "./styles.css";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from "./my-theme";
const example = require("./data/example.json");
import QuizCollectionPage from "./view/quiz-collection-page";

export default function App() {
  return <MantineProvider theme={theme}>
    <QuizCollectionPage collection={example}/>
  </MantineProvider>
}

