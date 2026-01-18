import { DefaultTheme, DarkTheme as NavDarkTheme } from "@react-navigation/native";

export const LightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: "#F9FAFB",
    card: "#FFFFFF",
    text: "#111827",
    border: "#E5E7EB",
    primary: "#2563EB",
    notification: "#2563EB"
  }
};

export const DarkTheme = {
  ...NavDarkTheme,
  dark: true,
  colors: {
    ...NavDarkTheme.colors,
    background: "#0F172A",
    card: "#020617",
    text: "#F8FAFC",
    border: "#1E293B",
    primary: "#3B82F6",
    notification: "#3B82F6"
  }
};
