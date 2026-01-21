import { getVolunteersApi, Volunteer } from "@/api/volunteer.api";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const LIMIT = 10;

export default function VolunteersList() {
    const theme = useTheme();

    const [data, setData] = useState<Volunteer[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchVolunteers = async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);
        try {
            const res = await getVolunteersApi({
                page: reset ? 1 : page,
                limit: LIMIT,
                search,
            });

            setHasMore(res.pagination.hasMore);
            setData((prev) => (reset ? res.data : [...prev, ...res.data]));
            setPage((prev) => (reset ? 2 : prev + 1));
        } catch (e) {
            setHasMore(false);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setHasMore(true);
        fetchVolunteers(true);
    }, [search]);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId((prev) => (prev === id ? null : id));
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* 🔍 SEARCH */}
            <TextInput
                placeholder="Search volunteers..."
                placeholderTextColor={theme.colors.text + "66"}
                value={search}
                onChangeText={setSearch}
                style={[
                    styles.search,
                    {
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                        backgroundColor: theme.colors.card,
                    },
                ]}
            />

            {/* LIST */}
            <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                onEndReached={() => fetchVolunteers()}
                onEndReachedThreshold={0.4}
                ListFooterComponent={
                    loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
                }
                renderItem={({ item }) => {
                    const expanded = expandedId === item._id;

                    return (
                        <Pressable
                            onPress={() => toggleExpand(item._id)}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                        >
                            {/* HEADER */}
                            <View style={styles.header}>
                                <View>
                                    <Text style={[styles.name, { color: theme.colors.text }]}>
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.subText, { color: theme.colors.text }]}>
                                        {item.email}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.status,
                                        { backgroundColor: theme.colors.primary + "22" },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: theme.colors.primary,
                                            fontSize: 12,
                                            fontWeight: "600",
                                        }}
                                    >
                                        Volunteer
                                    </Text>
                                </View>
                            </View>

                            {/* EXPANDED */}
                            {expanded && (
                                <View style={styles.details}>
                                    <InfoRow label="Phone" value={item.phone} theme={theme} />
                                    <InfoRow label="Role" value={item.role} theme={theme} />
                                </View>
                            )}
                        </Pressable>
                    );
                }}
            />

            {/* ➕ ADD VOLUNTEER BUTTON */}
            <TouchableOpacity
                style={[
                    styles.fab,
                    { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => {
                    console.log("Open Add Volunteer Modal");
                }}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>
        </View>
    );
}

/* ---------- SMALL COMPONENT ---------- */

function InfoRow({ label, value, theme }: any) {
    return (
        <View style={styles.infoRow}>
            <Text style={{ color: theme.colors.text, opacity: 0.6 }}>{label}</Text>
            <Text style={{ color: theme.colors.text }}>{value}</Text>
        </View>
    );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    search: {
        margin: 16,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
    },

    card: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
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

    subText: {
        fontSize: 13,
        opacity: 0.6,
        marginTop: 2,
    },

    status: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },

    details: {
        marginTop: 14,
        gap: 6,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },

    fabText: {
        color: "#fff",
        fontSize: 30,
        lineHeight: 32,
    },
});
