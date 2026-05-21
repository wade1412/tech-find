import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
  // Get theme from localStorage, default to light
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  // Sync localStorage when the theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Toggle the class on the document
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return {
    theme,
    toggleTheme,
  };
};
