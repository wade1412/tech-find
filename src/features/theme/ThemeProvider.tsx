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
          fontFamily: "inherit",
          h1: { fontFamily: headingFont },
          h2: { fontFamily: headingFont },
          h3: { fontFamily: headingFont },
          h4: { fontFamily: headingFont },
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
