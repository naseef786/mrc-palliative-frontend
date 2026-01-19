import { signupApi } from "@/api/auth.api";
import { useTheme } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Signup() {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "volunteer" as "admin" | "volunteer",
        phone: "",
        bloodGroup: "",
        dob: "",
        address: "",
        emergencyContact: "",
    });

    const [error, setError] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: signupApi,
        onSuccess: () => router.replace("/(auth)/login"),
        onError: (err: any) =>
            setError(err.response?.data?.message || "Signup failed"),
    });

    const submit = () => {
        if (!form.name || !form.email || form.password.length < 6) {
            setError("Please fill all required fields");
            return;
        }
        mutate(form);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            {Object.entries(form).map(([key, value]) =>
                key === "role" ? null : (
                    <TextInput
                        key={key}
                        placeholder={key}
                        placeholderTextColor={colors.text + "99"}
                        value={value}
                        secureTextEntry={key === "password"}
                        onChangeText={(v) => setForm({ ...form, [key]: v })}
                        style={styles.input}
                    />
                )
            )}

            {/* ROLE SELECT */}
            <View style={styles.roleRow}>
                {["volunteer", "admin"].map((r) => (
                    <Pressable
                        key={r}
                        style={[
                            styles.roleChip,
                            form.role === r && styles.roleActive,
                        ]}
                        onPress={() => setForm({ ...form, role: r as any })}
                    >
                        <Text
                            style={{
                                color: form.role === r ? "#fff" : colors.text,
                            }}
                        >
                            {r}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable
                style={[styles.button, isPending && styles.disabled]}
                onPress={submit}
                disabled={isPending}
            >
                <Text style={styles.buttonText}>
                    {isPending ? "Creating..." : "Create Account"}
                </Text>
            </Pressable>

            <Text style={styles.link} onPress={() => router.back()}>
                Already have an account? Login
            </Text>
        </ScrollView>
    );
}

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            padding: 20,
            backgroundColor: colors.background,
        },
        title: {
            fontSize: 24,
            marginBottom: 20,
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
        roleRow: {
            flexDirection: "row",
            gap: 12,
            marginBottom: 16,
        },
        roleChip: {
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
        },
        roleActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
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
