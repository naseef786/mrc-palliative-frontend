import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

export default function Card({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
        }
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12
  }
});
