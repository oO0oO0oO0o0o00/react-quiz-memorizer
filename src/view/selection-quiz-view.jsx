import classNames from "classnames";
import { Button, ActionIcon, Flex, Grid, Space, Center } from "@mantine/core";
import { IconBackspace } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import U from "../utils";
import { QuizStatus } from "../viewmodel/quiz-holders";

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
              variant="outline"
              size="xs"
              key={i}
              onClick={() => holder.handleSelectEntry(i)}
            >
              {e}
            </Button>
          );
        })}
    </Flex>
  );
}

export function OrderingQuizOptionsBar({ holder }) {
  return (
    <>
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
                variant={holder.isEntrySelected(i) ? "filled" : "outline"}
                size="xs"
                disabled={holder.isEntrySelected(i)}
                key={i}
                onClick={() => holder.handleSelectEntry(i)}
              >
                {e}
              </Button>
            );
          })}
      </Flex>
      <Space h="md" />
      <Grid>
        <Grid.Col span={{ base: 1, md: 4, sm: 4, xs: 4 }}>
          <Center>
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
            </ActionIcon>
          </Center>
        </Grid.Col>
        <Grid.Col span="auto">
          <Button size="xs" radius="lg" onClick={() => holder.judge()} style={{ width: "100%" }}>继续</Button>
        </Grid.Col>
      </Grid>
    </>
  );
}
