import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useMemo, type ReactNode } from "react";
import { createAppTheme } from "./muiTheme";
import { useTheme } from "./useTheme";

interface MuiThemeProviderProps {
  children: ReactNode;
}

export function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  const { theme } = useTheme();
  const muiTheme = useMemo(() => createAppTheme(theme), [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
