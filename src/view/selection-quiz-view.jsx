import classNames from "classnames";
import { Button, ActionIcon, Flex } from "@mantine/core";
import { IconBackspace } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import U from "../utils";
import { QuizStatus } from "../viewmodel/quiz";

export function SelectionQuizView({
  active,
  holder,
  onFocused,
  innerRef,
}) {
  const text = holder.state.value.reduce(
    (s, i) => s + holder.quiz.entries[i], "");
  return (
    <span
      className={classNames({
        space: true,
        active: active,
        wrong: holder.state.status === QuizStatus.wrong,
        right: holder.state.status === QuizStatus.right,
      })}
      tabIndex={active ? 0 : null}
      onFocus={() => onFocused()}
      ref={innerRef}
    >
      {U.wtfPad(text, 10)}
    </span>
  );
}

export function SelectionQuizOptionsBar({ holder }) {
  return (
    <Flex
        gap={{ base: "sm", xs: "xs" }}
        justify="flex-start"
        align="flex-start"
        direction="row"
        wrap="wrap"
      >
      {holder.quiz.entries
        .map((e, i) => {
          return (
            <Button
              variant={holder.shouldHighlightEntry(i) ? "filled" : "outline"}
              size="xs"
              disabled={holder.shouldDisableEntry(i)}
              key={i}
              onClick={() => holder.handleSelectEntry(i)}
            >
              {e}
            </Button>
          );
        })
        .concat(
          holder.shouldShowActions
            ? [
                <ActionIcon
                  variant="light"
                  aria-label="backspace"
                  size="input-xs"
                  key="backspace"
                  disabled={!holder.state.value.length}
                  onClick={() => holder.handleBackspace()}
                >
                  <IconBackspace
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>,
                <ActionIcon aria-label="confirm" size="input-xs" key="confirm" onClick={() => holder.judge()}>
                  <IconCheck style={{ width: "70%", height: "70%" }} stroke={1.5} />
                </ActionIcon>,
              ]
            : []
        )}
    </Flex>
  );
}
