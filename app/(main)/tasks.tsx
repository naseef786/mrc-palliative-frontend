import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";

export default function Tasks() {
    const theme = useTheme();
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}
        >
            <Text style={{ color: theme.colors.text, fontSize: 18 }}>Welcome Tasks</Text>
        </View>
    );
}
