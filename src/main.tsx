import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Theme } from "@chakra-ui/react";

import App from "./App.tsx";
import theme from "./theme.ts";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={theme}>
      <Theme appearance="dark">
        <App />
      </Theme>
    </ChakraProvider>
  </StrictMode>
);
