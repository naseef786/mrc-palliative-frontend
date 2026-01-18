import { ReactNode } from "react";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "./colors";
import { useThemeStore } from "../store/theme.store";

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const { mode } = useThemeStore();

  const theme =
    mode === "system"
      ? system === "dark"
        ? DarkTheme
        : LightTheme
      : mode === "dark"
      ? DarkTheme
      : LightTheme;

  return <ThemeProvider value={theme}>{children}</ThemeProvider>;
}
