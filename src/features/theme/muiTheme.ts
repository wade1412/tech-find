import { createTheme } from "@mui/material";
import type { ThemeMode } from "./theme.types";

const headingFont = '"Manrope", system-ui, sans-serif';

export const themeColors = {
  light: "#fafafa",
  dark: "#09090b",
};

const palettes = {
  light: {
    primary: "#eab308",
    background: "#fafafa",
    paper: "#ffffff",
    text: "#18181b",
    secondary: "#52525b",
    divider: "#e4e4e7",
    autocomplete: {
      paperBorder: "#e4e4e7",
      background: "#ffffff",
      text: "#a1a1aa",
      hover: "#f4f4f5",
      selected: "rgba(234, 179, 8, 0.08)",
      selectedHover: "rgba(234, 179, 8, 0.12)",
    },
  },
  dark: {
    primary: "#facc15",
    background: "#09090b",
    paper: "#18181b",
    text: "#fafafa",
    secondary: "#a1a1aa",
    divider: "#27272a",
    autocomplete: {
      paperBorder: "#27272a",
      background: "#18181b",
      text: "#71717a",
      hover: "#27272a",
      selected: "rgba(250, 204, 21, 0.1)",
      selectedHover: "rgba(250, 204, 21, 0.15)",
    },
  },
} as const;

export const createAppTheme = (mode: ThemeMode) => {
  const colors = palettes[mode];

  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      background: { default: colors.background, paper: colors.paper },
      text: { primary: colors.text, secondary: colors.secondary },
      divider: colors.divider,
    },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      h1: { fontFamily: headingFont },
      h2: { fontFamily: headingFont },
      h3: { fontFamily: headingFont },
      h4: { fontFamily: headingFont },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            borderRadius: "0.75rem",
            marginTop: "6px",
            border: `1px solid ${colors.autocomplete.paperBorder}`,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
          },
          listbox: {
            padding: "6px",
            backgroundColor: colors.autocomplete.background,
            // Styles for groupBy
            "& .MuiAutocomplete-groupLabel": {
              fontFamily: headingFont,
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              backgroundColor: colors.autocomplete.background,
              color: colors.autocomplete.text,
              padding: "6px 12px",
            },

            "& .MuiAutocomplete-option": {
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: "0.875rem",
              borderRadius: "0.5rem",
              padding: "8px 12px",
              margin: "2px 0",
              transition: "background-color 0.15s ease, color 0.15s ease",
              // Hover
              '&[data-focus="true"]': {
                backgroundColor: colors.autocomplete.hover,
              },

              '&[aria-selected="true"]': {
                backgroundColor: colors.autocomplete.selected,
                color: colors.primary,
                fontWeight: 600,
                '&[data-focus="true"]': {
                  backgroundColor: colors.autocomplete.selectedHover,
                },
              },
            },
          },
        },
      },
    },
  });
};
