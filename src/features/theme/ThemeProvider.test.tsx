import { useTheme as useMuiTheme } from "@mui/material/styles";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MuiThemeProvider } from "./MuiThemeProvider";
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./useTheme";

function ThemeStateProbe() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  );
}

function MuiThemeProbe() {
  const theme = useMuiTheme();

  return <span>{theme.palette.mode}</span>;
}

describe("theme providers", () => {
  beforeEach(() => {
    const values = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
      clear: () => values.clear(),
    });
    document.documentElement.classList.remove("dark");
    document.documentElement.style.removeProperty("color-scheme");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("manages the application theme without requiring MUI", async () => {
    localStorage.setItem("theme", "light");
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeStateProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "light" }));

    expect(screen.getByRole("button", { name: "dark" })).not.toBeNull();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("maps the shared theme state to MUI inside the scoped provider", async () => {
    localStorage.setItem("theme", "light");
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeStateProbe />
        <MuiThemeProvider>
          <MuiThemeProbe />
        </MuiThemeProvider>
      </ThemeProvider>,
    );

    expect(screen.getByText("light", { selector: "span" })).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "light" }));

    expect(screen.getByText("dark", { selector: "span" })).not.toBeNull();
  });
});
