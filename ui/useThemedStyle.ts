import { useTheme } from "@react-navigation/native";

export function useThemedColors() {
    const theme = useTheme();

    return {
        bg: theme.colors.background,
        card: theme.colors.card,
        text: theme.colors.text,
        border: theme.colors.border,
        primary: theme.colors.primary,
        muted: theme.colors.text + "66",
    };
}
