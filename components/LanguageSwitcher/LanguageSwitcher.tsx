import { useLanguageStore } from "@/store/language.store";
import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguageStore();
    const theme = useTheme();

    return (
        <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={() => setLanguage("en")}>
                <Text
                    style={{
                        color:
                            language === "en"
                                ? theme.colors.primary
                                : theme.colors.text,
                        fontWeight: "600",
                    }}
                >
                    English
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setLanguage("ml")}>
                <Text
                    style={{
                        color:
                            language === "ml"
                                ? theme.colors.primary
                                : theme.colors.text,
                        fontWeight: "600",
                    }}
                >
                    മലയാളം
                </Text>
            </TouchableOpacity>
        </View>
    );
}
