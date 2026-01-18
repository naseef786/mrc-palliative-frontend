import { useTranslation } from "@/hooks/useTranslation";
import { Schedule } from "@/store/shedule.store";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    item: Schedule;
    role: "admin" | "volunteer";
    onEdit: () => void;
    onDelete: () => void;
    onAssign?: () => void;
    onUnassign?: () => void;
}

export function ScheduleCard({
    item,
    role,
    onEdit,
    onDelete,
    onAssign,
    onUnassign,
}: Props) {
    const theme = useTheme();
    const t = useTranslation();
    const statusColor = {
        pending: "#F59E0B",
        "in-progress": "#3B82F6",
        completed: "#22C55E",
        expired: "#EF4444",
        default: theme.colors.text,
    }[item.status];

    const formattedDate = new Date(item.date).toLocaleString([], {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                },
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {item.patientName}
                </Text>

                <View style={[styles.badge, { backgroundColor: statusColor + "22" }]}>
                    <Text style={{ color: item?.status ? statusColor : theme.colors.text, fontSize: item?.status ? 12 : 6, fontWeight: "600" }}>
                        {t(item?.status ? `status.${item.status}` : "common.nullStateMessage")}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <Text style={[styles.task, { color: theme.colors.text }]}>
                {item.task}
            </Text>

            <Text style={[styles.meta, { color: theme.colors.text + "99" }]}>
                📅 {formattedDate}
            </Text>

            {item.volunteerId && (
                <Text style={[styles.meta, { color: theme.colors.text + "99" }]}>
                    👤 Assigned
                </Text>
            )}

            {/* Divider */}
            <View
                style={[
                    styles.divider,
                    { backgroundColor: theme.colors.border },
                ]}
            />

            {/* Actions */}
            <View style={styles.actions}>
                {role === "admin" && (
                    <>
                        <TouchableOpacity onPress={onEdit}>
                            <Text style={[styles.actionText, { color: theme.colors.primary }]}>
                                {t("common.edit")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onDelete}>
                            <Text style={[styles.actionText, { color: "#EF4444" }]}>
                                {t("common.delete")}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {role === "volunteer" &&
                    (!item.volunteerId ? (
                        <TouchableOpacity onPress={onAssign}>
                            <Text
                                style={[styles.actionText, { color: theme.colors.primary }]}
                            >
                                Assign to me
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={onUnassign}>
                            <Text
                                style={[styles.actionText, { color: "#F59E0B" }]}
                            >
                                Unassign
                            </Text>
                        </TouchableOpacity>
                    ))}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,

        // Shadow (iOS)
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },

        // Elevation (Android)
        elevation: 4,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    task: {
        fontSize: 14,
        marginBottom: 6,
    },
    meta: {
        fontSize: 12,
        marginBottom: 4,
    },
    divider: {
        height: 1,
        marginVertical: 12,
        opacity: 0.5,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
    },
    actionText: {
        fontSize: 14,
        fontWeight: "500",
    },
});
