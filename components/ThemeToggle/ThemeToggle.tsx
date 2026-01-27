import { View, Button } from "react-native";
import { useThemeStore } from "../../store/theme.store";

export default function ThemeToggle() {
  const { setMode } = useThemeStore();

  return (
    <View>
      <Button title="Light" onPress={() => setMode("light")} />
      <Button title="Dark" onPress={() => setMode("dark")} />
      <Button title="System" onPress={() => setMode("system")} />
    </View>
  );
}
