import React from "react";
import classNames from "classnames";
import { Button } from "@mantine/core";
import ContentEditable from "./react-contenteditable";
import U from "../utils";
import { QuizStatus } from "../viewmodel/quiz-holders";

const maxSpaces = 10;

export function FillingQuizView({
  active,
  holder,
  onFocused,
  innerRef,
}) {
  const contentEditable = React.createRef();
  const spaces = Math.max(maxSpaces - U.wtfLength(holder.state.value), 0);

  function handleTextChange(e) {
    if (e.target.value.includes("\n")) {
      holder.judge();
      return;
    }
    let newState = e.target.value
      .replaceAll(/[\r\n\s]+/g, " ");
    holder.setState({ value: newState });
  }

  function updateRef(el) {
    contentEditable.current = el;
    if (typeof innerRef === "function") {
      innerRef(el);
    } else if (innerRef) {
      innerRef.current = el;
    }
  }

  return (
    <ContentEditable
      tagName="span"
      innerRef={updateRef}
      text={holder.state.value}
      onChange={handleTextChange}
      onFocus={() => onFocused()}
      disabled={!active || holder.state.status !== QuizStatus.none}
      className={classNames({
        space: true,
        active: active,
        wrong: holder.state.status === QuizStatus.wrong,
        right: holder.state.status === QuizStatus.right,
      })}
      enterKeyHint="done"
      data-pre={U.spaceHolderChar.repeat(Math.floor(spaces / 2))}
      data-post={U.spaceHolderChar.repeat(Math.ceil(spaces / 2))}
    />
  );
}

export function FillingQuizOptionsBar({ holder }) {
  return <Button size="xs" radius="lg" onClick={() => holder.judge()} style={{ width: "100%" }}>确认</Button>
}