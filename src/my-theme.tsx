import { createTheme, MantineColorsTuple } from "@mantine/core";

const oranges: MantineColorsTuple = [
  "#ffeee3",
  "#ffdecc",
  "#ffba9a",
  "#ff9663",
  "#ff7636",
  "#ff6218",
  "#ff5706",
  "#e44700",
  "#cb3e00",
  "#b23200",
];

const theme = createTheme({
  colors: {
    oranges,
  },
  primaryColor: "oranges",
});

export { theme };
