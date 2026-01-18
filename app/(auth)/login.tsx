import { router } from "expo-router";
import { Button, View } from "react-native";
import { useAuthStore } from "../../store/auth.store";

export default function Login() {
  const { login } = useAuthStore();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button
        title="Login as Admin"
        onPress={() => {
          login("FAKE_TOKEN", "admin", { name: "Admin User", email: "admin@example.com" });
          router.replace("/(main)/home");
        }}
      />
    </View>
  );
}
