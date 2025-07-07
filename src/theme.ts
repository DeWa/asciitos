import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Gray scale
        gray: {
          50: { value: "#f9fafb" },
          100: { value: "#f3f4f6" },
          200: { value: "#e5e7eb" },
          300: { value: "#d1d5db" },
          400: { value: "#9ca3af" },
          500: { value: "#6b7280" },
          600: { value: "#4b5563" },
          650: { value: "#404040" },
          700: { value: "#374151" },
          750: { value: "#2d3748" },
          800: { value: "#1f2937" },
          900: { value: "#111827" },
          950: { value: "#030712" },
        },
        // Blue scale
        blue: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
          800: { value: "#1e40af" },
          900: { value: "#1e3a8a" },
          950: { value: "#172554" },
        },
        // Red scale
        red: {
          50: { value: "#fef2f2" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#ef4444" },
          600: { value: "#dc2626" },
          700: { value: "#b91c1c" },
          800: { value: "#991b1b" },
          900: { value: "#7f1d1d" },
          950: { value: "#450a0a" },
        },
        // Green scale
        green: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#15803d" },
          800: { value: "#166534" },
          900: { value: "#14532d" },
          950: { value: "#052e16" },
        },
        // Yellow scale
        yellow: {
          50: { value: "#fefce8" },
          100: { value: "#fef3c7" },
          200: { value: "#fde68a" },
          300: { value: "#fcd34d" },
          400: { value: "#fbbf24" },
          500: { value: "#f59e0b" },
          600: { value: "#d97706" },
          700: { value: "#b45309" },
          800: { value: "#92400e" },
          900: { value: "#78350f" },
          950: { value: "#451a03" },
        },
        // Purple scale
        purple: {
          50: { value: "#faf5ff" },
          100: { value: "#f3e8ff" },
          200: { value: "#e9d5ff" },
          300: { value: "#d8b4fe" },
          400: { value: "#c084fc" },
          500: { value: "#a855f7" },
          600: { value: "#9333ea" },
          700: { value: "#7c3aed" },
          800: { value: "#6b21a8" },
          900: { value: "#581c87" },
          950: { value: "#3b0764" },
        },
        // Pink scale
        pink: {
          50: { value: "#fdf2f8" },
          100: { value: "#fce7f3" },
          200: { value: "#fbcfe8" },
          300: { value: "#f9a8d4" },
          400: { value: "#f472b6" },
          500: { value: "#ec4899" },
          600: { value: "#db2777" },
          700: { value: "#be185d" },
          800: { value: "#9d174d" },
          900: { value: "#831843" },
          950: { value: "#500724" },
        },
        // Orange scale
        orange: {
          50: { value: "#fff7ed" },
          100: { value: "#ffedd5" },
          200: { value: "#fed7aa" },
          300: { value: "#fdba74" },
          400: { value: "#fb923c" },
          500: { value: "#f97316" },
          600: { value: "#ea580c" },
          700: { value: "#c2410c" },
          800: { value: "#9a3412" },
          900: { value: "#7c2d12" },
          950: { value: "#431407" },
        },
        // Teal scale
        teal: {
          50: { value: "#f0fdfa" },
          100: { value: "#ccfbf1" },
          200: { value: "#99f6e4" },
          300: { value: "#5eead4" },
          400: { value: "#2dd4bf" },
          500: { value: "#14b8a6" },
          600: { value: "#0d9488" },
          700: { value: "#0f766e" },
          800: { value: "#115e59" },
          900: { value: "#134e4a" },
          950: { value: "#042f2e" },
        },
        // Cyan scale
        cyan: {
          50: { value: "#ecfeff" },
          100: { value: "#cffafe" },
          200: { value: "#a5f3fc" },
          300: { value: "#67e8f9" },
          400: { value: "#22d3ee" },
          500: { value: "#06b6d4" },
          600: { value: "#0891b2" },
          700: { value: "#0e7490" },
          800: { value: "#155e75" },
          900: { value: "#164e63" },
          950: { value: "#083344" },
        },
        // Indigo scale
        indigo: {
          50: { value: "#eef2ff" },
          100: { value: "#e0e7ff" },
          200: { value: "#c7d2fe" },
          300: { value: "#a5b4fc" },
          400: { value: "#818cf8" },
          500: { value: "#6366f1" },
          600: { value: "#4f46e5" },
          700: { value: "#4338ca" },
          800: { value: "#3730a3" },
          900: { value: "#312e81" },
          950: { value: "#1e1b4b" },
        },
        // Neutral colors
        white: { value: "#ffffff" },
        black: { value: "#000000" },
        transparent: { value: "transparent" },
        current: { value: "currentColor" },
      },
    },
    semanticTokens: {
      colors: {
        // Background colors
        bg: {
          DEFAULT: { value: "{colors.gray.900}" },
          primary: { value: "{colors.gray.800}" },
          secondary: { value: "{colors.gray.700}" },
          subtle: { value: "{colors.gray.600}" },
          muted: { value: "{colors.gray.500}" },
          // Panel backgrounds
          panel: { value: "{colors.gray.800}" },
          panelHover: { value: "{colors.gray.750}" },
          panelActive: { value: "{colors.gray.700}" },
          // Card backgrounds
          card: { value: "{colors.gray.800}" },
          cardHover: { value: "{colors.gray.750}" },
          cardActive: { value: "{colors.gray.700}" },
          // Input backgrounds
          input: { value: "{colors.gray.700}" },
          inputHover: { value: "{colors.gray.650}" },
          inputFocus: { value: "{colors.gray.600}" },
          inputDisabled: { value: "{colors.gray.800}" },
          // Button backgrounds
          button: { value: "{colors.gray.700}" },
          buttonHover: { value: "{colors.gray.600}" },
          buttonActive: { value: "{colors.gray.500}" },
          buttonPrimary: { value: "{colors.blue.600}" },
          buttonPrimaryHover: { value: "{colors.blue.500}" },
          buttonPrimaryActive: { value: "{colors.blue.700}" },
          buttonOutline: { value: "{colors.gray.100}" },
          buttonOutlineHover: { value: "{colors.white}" },
          buttonGhost: { value: "{colors.gray.100}" },
          buttonGhostHover: { value: "{colors.white}" },
          buttonWarning: { value: "{colors.red.600}" },
          buttonWarningHover: { value: "{colors.red.500}" },
          buttonWarningActive: { value: "{colors.red.700}" },
          // Toolbar backgrounds
          toolbar: { value: "{colors.gray.800}" },
          toolbarHover: { value: "{colors.gray.750}" },
          toolbarActive: { value: "{colors.gray.700}" },
          // Modal backgrounds
          modal: { value: "{colors.gray.800}" },
          modalOverlay: { value: "rgba(0, 0, 0, 0.5)" },
          // Dropdown backgrounds
          dropdown: { value: "{colors.gray.800}" },
          dropdownHover: { value: "{colors.gray.700}" },
          dropdownActive: { value: "{colors.gray.600}" },
          // Status backgrounds
          success: { value: "{colors.green.900}" },
          warning: { value: "{colors.yellow.900}" },
          error: { value: "{colors.red.900}" },
          info: { value: "{colors.blue.900}" },
        },
        // Foreground colors
        fg: {
          DEFAULT: { value: "{colors.gray.100}" },
          muted: { value: "{colors.gray.400}" },
          subtle: { value: "{colors.gray.500}" },
          inverse: { value: "{colors.gray.900}" },
          // Component text colors
          input: { value: "{colors.gray.100}" },
          inputPlaceholder: { value: "{colors.gray.500}" },
          inputDisabled: { value: "{colors.gray.600}" },
          button: { value: "{colors.gray.100}" },
          buttonPrimary: { value: "{colors.white}" },
          buttonDisabled: { value: "{colors.gray.600}" },
          buttonOutline: { value: "{colors.gray.800}" },
          buttonGhost: { value: "{colors.gray.100}" },
          panel: { value: "{colors.gray.100}" },
          card: { value: "{colors.gray.100}" },
          toolbar: { value: "{colors.gray.100}" },
          // Interactive text colors
          link: { value: "{colors.blue.400}" },
          linkHover: { value: "{colors.blue.300}" },
          linkActive: { value: "{colors.blue.500}" },
          // Status text colors
          success: { value: "{colors.green.400}" },
          warning: { value: "{colors.yellow.400}" },
          error: { value: "{colors.red.400}" },
          info: { value: "{colors.blue.400}" },
          // Emphasis text colors
          emphasized: { value: "{colors.white}" },
          highlighted: { value: "{colors.blue.300}" },
          selected: { value: "{colors.blue.400}" },
          // Secondary text colors
          secondary: { value: "{colors.gray.300}" },
          tertiary: { value: "{colors.gray.400}" },
          quaternary: { value: "{colors.gray.500}" },
        },
        // Border colors
        border: {
          DEFAULT: { value: "{colors.gray.600}" },
          subtle: { value: "{colors.gray.500}" },
          muted: { value: "{colors.gray.400}" },
          // Component borders
          input: { value: "{colors.gray.600}" },
          inputFocus: { value: "{colors.blue.500}" },
          inputError: { value: "{colors.red.500}" },
          button: { value: "{colors.gray.600}" },
          buttonPrimary: { value: "{colors.blue.600}" },
          panel: { value: "{colors.gray.600}" },
          card: { value: "{colors.gray.600}" },
        },
        // Accent colors
        accent: {
          DEFAULT: { value: "{colors.blue.500}" },
          subtle: { value: "{colors.blue.400}" },
          muted: { value: "{colors.blue.300}" },
        },
        // Success colors
        success: {
          DEFAULT: { value: "{colors.green.500}" },
          subtle: { value: "{colors.green.400}" },
          muted: { value: "{colors.green.300}" },
        },
        // Warning colors
        warning: {
          DEFAULT: { value: "{colors.yellow.500}" },
          subtle: { value: "{colors.yellow.400}" },
          muted: { value: "{colors.yellow.300}" },
        },
        // Error colors
        error: {
          DEFAULT: { value: "{colors.red.500}" },
          subtle: { value: "{colors.red.400}" },
          muted: { value: "{colors.red.300}" },
        },
        // Shadow tokens
        shadow: {
          sm: { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
          DEFAULT: { value: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" },
          md: { value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
          lg: { value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
          xl: {
            value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
          // Dark theme shadows
          dark: { value: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)" },
          darkMd: { value: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)" },
          darkLg: {
            value: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
  },
});

export default createSystem(defaultConfig, config);
