const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
const theme =
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : systemPrefersDark
      ? "dark"
      : "light";

const themeColor = theme === "dark" ? "#09090b" : "#fafafa";

document
  .querySelector('meta[name="theme-color"]')
  ?.setAttribute("content", themeColor);

document.documentElement.classList.toggle("dark", theme === "dark");
document.documentElement.style.colorScheme = theme;
