import { Redirect } from "expo-router";
import { useAuthStore } from "../store/auth.store";

export default function Index() {
  const role = useAuthStore((s) => s.role);

  if (!role) return <Redirect href="/(auth)/login" />;

  // All logged-in users go to tab navigator
  return <Redirect href="/(main)/analytics" />;
}
