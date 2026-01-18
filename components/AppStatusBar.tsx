// components/AppStatusBar.tsx
import { useTheme } from "@react-navigation/native";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

export default function AppStatusBar() {
    const theme = useTheme();

    useEffect(() => {
        StatusBar.setBarStyle(theme.dark ? "light-content" : "dark-content", true);

        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(theme.colors.card, true); // set Android background
            StatusBar.setTranslucent(false); // optional: push content below status bar
        }
    }, [theme]);

    return null;
}
