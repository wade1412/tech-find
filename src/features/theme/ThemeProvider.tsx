import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ThemeProvider as MuiProvider,
  createTheme,
} from "@mui/material/styles";
import { ThemeContext } from "./ThemeContext";
import type { ThemeMode } from "./theme.types";
import { CssBaseline } from "@mui/material";

interface ThemeProviderProps {
  children: ReactNode;
}

const headingFont = '"Manrope", system-ui, sans-serif';

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Get from local storage
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  // Sync localStorage when the theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Toggle the class on the document
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Creating MUI Theme
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: {
            main: theme === "dark" ? "#facc15" : "#eab308",
          },
          background: {
            default: theme === "dark" ? "#09090b" : "#fafafa",

            paper: theme === "dark" ? "#18181b" : "#ffffff",
          },

          text: {
            primary: theme === "dark" ? "#fafafa" : "#18181b",

            secondary: theme === "dark" ? "#a1a1aa" : "#52525b",
          },

          divider: theme === "dark" ? "#27272a" : "#e4e4e7",
        },

        typography: {
          fontFamily: '"Inter", system-ui, sans-serif',
          h1: { fontFamily: headingFont },
          h2: { fontFamily: headingFont },
          h3: { fontFamily: headingFont },
          h4: { fontFamily: headingFont },
        },
        // Clearing default styles
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
                border:
                  theme === "dark" ? "1px solid #27272a" : "1px solid #e4e4e7",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
              },
              listbox: {
                padding: "6px",
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                // Styles for groupBy
                "& .MuiAutocomplete-groupLabel": {
                  fontFamily: '"Manrope", system-ui, sans-serif',
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                  color: theme === "dark" ? "#71717a" : "#a1a1aa",
                  padding: "6px 12px",
                },

                "& .MuiAutocomplete-option": {
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontSize: "0.875rem",
                  borderRadius: "0.5rem",
                  padding: "8px 12px",
                  margin: "2px 0",
                  transition: "all 0.15s ease",
                  // Hover
                  '&[data-focus="true"]': {
                    backgroundColor: theme === "dark" ? "#27272a" : "#f4f4f5",
                  },

                  '&[aria-selected="true"]': {
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(250, 204, 21, 0.1)"
                        : "rgba(234, 179, 8, 0.08)",
                    color: theme === "dark" ? "#facc15" : "#eab308",
                    fontWeight: 600,
                    '&[data-focus="true"]': {
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(250, 204, 21, 0.15)"
                          : "rgba(234, 179, 8, 0.12)",
                    },
                  },
                },
              },
            },
          },
        },
      }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiProvider>
    </ThemeContext.Provider>
  );
}
