import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "{colors.gray.800}" },
          primary: { value: "{colors.gray.800}" },
          secondary: { value: "{colors.gray.700}" },
          subtle: { value: "{colors.gray.700}" },
        },
      },
    },
  },
});

export default createSystem(defaultConfig, config);
