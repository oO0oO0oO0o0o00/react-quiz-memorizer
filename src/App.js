import "@mantine/core/styles.css";
import "./styles.css";
import React from "react";
import { MantineProvider, Group, Image, Center } from "@mantine/core";
import { theme } from "./my-theme";
import QuizPage from "./view/quiz-page";
const example = require("./data/example.json");

export default function App() {
  return <MantineProvider theme={theme}>
    <QuizPage articleData={example} onFinish={null}/>
  </MantineProvider>
}
