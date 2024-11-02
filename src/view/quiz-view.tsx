import { MutableRefObject } from "react";
import { QuizHolder } from "../viewmodel/quiz-holders";

export interface QuizViewProps<T, H extends QuizHolder<T>> {
  active: boolean;
  holder: H;
  onFocused: (() => void);
  innerRef: ((e: HTMLElement) => void) | MutableRefObject<HTMLElement | null>;
}

export interface QuizOptionsBarProps<H> { 
  holder: H;
}
