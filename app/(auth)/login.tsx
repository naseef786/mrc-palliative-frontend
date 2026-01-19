import { loginApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useTheme } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.token, data.user.role, data.user);
      router.replace("/(main)/home");
    },
  });
  console.log(error?.message);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.text + "99"}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.text + "99"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {error && <Text style={styles.error}>Invalid credentials</Text>}

      <Pressable
        style={[styles.button, isPending && styles.disabled]}
        onPress={() => mutate({ email, password })}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? "Logging in..." : "Login"}
        </Text>
      </Pressable>

      <Text style={styles.link} onPress={() => router.push("/(auth)/signup")}>
        Create account
      </Text>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      marginBottom: 24,
      color: colors.text,
      fontWeight: "600",
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      borderRadius: 10,
      marginBottom: 14,
      color: colors.text,
      backgroundColor: colors.card,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },
    disabled: {
      opacity: 0.6,
    },
    error: {
      color: colors.notification,
      marginBottom: 10,
    },
    link: {
      marginTop: 18,
      color: colors.primary,
      textAlign: "center",
    },
  });
