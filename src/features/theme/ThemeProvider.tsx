import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider as MuiProvider } from "@mui/material/styles";
import { ThemeContext } from "./ThemeContext";
import type { ThemeMode } from "./theme.types";
import { CssBaseline } from "@mui/material";
import { createAppTheme, themeColors } from "./muiTheme";

interface ThemeProviderProps {
  children: ReactNode;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem("theme");

  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  // Sync localStorage when the theme changes
  useEffect(() => {
    const root = document.documentElement;
    const color = theme === "dark" ? themeColors.dark : themeColors.light;

    localStorage.setItem("theme", theme);
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Creating MUI Theme
  const muiTheme = useMemo(() => createAppTheme(theme), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiProvider>
    </ThemeContext.Provider>
  );
}
