import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider as MuiProvider } from "@mui/material/styles";
import { ThemeContext } from "./ThemeContext";
import type { ThemeMode } from "./theme.types";
import { CssBaseline } from "@mui/material";
import { createAppTheme } from "./muiTheme";

interface ThemeProviderProps {
  children: ReactNode;
}

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
