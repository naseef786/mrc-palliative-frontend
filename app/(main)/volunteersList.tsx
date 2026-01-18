import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from "react-native";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ---------------- MOCK DATA ---------------- */

const MOCK_VOLUNTEERS = [
    {
        id: "1",
        name: "Aisha Khan",
        phone: "+971 50 123 4567",
        email: "aisha.khan@email.com",
        skills: ["Nursing", "Elder Care"],
        completedTasks: 42,
        status: "Active",
    },
    {
        id: "2",
        name: "Mohammed Ali",
        phone: "+971 55 987 6543",
        email: "mohammed.ali@email.com",
        skills: ["First Aid", "Patient Support"],
        completedTasks: 31,
        status: "Busy",
    },
    {
        id: "3",
        name: "Sara Ahmed",
        phone: "+971 52 444 2299",
        email: "sara.ahmed@email.com",
        skills: ["Physiotherapy", "Home Care"],
        completedTasks: 58,
        status: "Active",
    },
];

/* ---------------- COMPONENT ---------------- */

export default function VolunteersList() {
    const theme = useTheme();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={MOCK_VOLUNTEERS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const expanded = expandedId === item.id;

                    return (
                        <Pressable
                            onPress={() => toggleExpand(item.id)}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                        >
                            {/* Header Row */}
                            <View style={styles.header}>
                                <View>
                                    <Text style={[styles.name, { color: theme.colors.text }]}>
                                        {item.name}
                                    </Text>
                                    <Text style={{ color: theme.colors.text, opacity: 0.6 }}>
                                        {item.completedTasks} tasks completed
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.status,
                                        {
                                            backgroundColor:
                                                item.status === "Active"
                                                    ? "#22c55e"
                                                    : "#f97316",
                                        },
                                    ]}
                                >
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </View>
                            </View>

                            {/* Expanded Section */}
                            {expanded && (
                                <View style={styles.details}>
                                    <InfoRow label="Phone" value={item.phone} theme={theme} />
                                    <InfoRow label="Email" value={item.email} theme={theme} />

                                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                                        Skills
                                    </Text>

                                    <View style={styles.skillsContainer}>
                                        {item.skills.map((skill, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.skillChip,
                                                    { backgroundColor: theme.colors.primary + "22" },
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        color: theme.colors.primary,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {skill}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function InfoRow({ label, value, theme }: any) {
    return (
        <View style={styles.infoRow}>
            <Text style={{ color: theme.colors.text, opacity: 0.6 }}>{label}</Text>
            <Text style={{ color: theme.colors.text }}>{value}</Text>
        </View>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
    },

    status: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },

    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    details: {
        marginTop: 12,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    sectionTitle: {
        marginTop: 10,
        marginBottom: 6,
        fontWeight: "600",
    },

    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    skillChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
});
