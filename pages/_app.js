import "../styles/globals.css";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useState } from "react";
const { HydrationProvider } = require("react-hydration-provider");
import initAuth from "initAuth";

initAuth();

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <HydrationProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme }}
        >
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </ColorSchemeProvider>
    </HydrationProvider>
  );
}

export default MyApp;
