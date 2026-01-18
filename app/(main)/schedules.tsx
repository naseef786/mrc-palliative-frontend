import { ScheduleFormModal } from "@/components/ScheduleFormModal";
import { useScheduleStore } from "@/store/shedule.store";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ScheduleCard } from "../../components/ScheduleCard";
import { useAuthStore } from "../../store/auth.store";


export default function Schedules() {
    const theme = useTheme();
    const role = useAuthStore((s) => s.role);
    const volunteerId = useAuthStore((s) => s.userId);

    const schedules = useScheduleStore((s) => s.schedules);
    const deleteSchedule = useScheduleStore((s) => s.deleteSchedule);
    const assignSelf = useScheduleStore((s) => s.assignSelf);
    const unassignSelf = useScheduleStore((s) => s.unassignSelf);

    const [editing, setEditing] = useState<any>(null);
    const [open, setOpen] = useState(false);

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
            <FlatList
                data={schedules}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ScheduleCard
                        item={item}
                        role={role === "admin" ? "admin" : "volunteer"}
                        onEdit={() => {
                            setEditing(item);
                            setOpen(true);
                        }}
                        onDelete={() => deleteSchedule(item.id)}
                        onAssign={() => assignSelf(item.id, volunteerId || "")}
                        onUnassign={() => unassignSelf(item.id)}
                    />
                )}
            />

            {role === "admin" && (
                <TouchableOpacity
                    onPress={() => setOpen(true)}
                    style={{
                        position: "absolute",
                        right: 24,
                        bottom: 24,
                        backgroundColor: theme.colors.primary,
                        borderRadius: 32,
                        padding: 18,
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 18 }}>＋</Text>
                </TouchableOpacity>
            )}

            <ScheduleFormModal
                visible={open}
                onClose={() => {
                    setEditing(null);
                    setOpen(false);
                }}
                editing={editing}
            />
        </View>
    );
}
