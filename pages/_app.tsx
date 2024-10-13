import type { AppProps } from 'next/app'
import "@mantine/core/styles.css";
import "../src/styles.css";
import { theme } from "../src/my-theme";
import { MantineProvider } from '@mantine/core';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <MantineProvider theme={theme}>
    <Component {...pageProps} />
  </MantineProvider>
}
