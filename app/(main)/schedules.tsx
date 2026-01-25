import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { ScheduleCard } from "@/components/ScheduleCard";

import { ScheduleFormModal } from "@/components/ScheduleFormModal/index";
import {
    useAssignSchedule,
    useDeleteScheduleMutation,
    useSchedulesQueryInfinite,
    useUnassignSchedule,
} from "@/hooks/useSchedules";
import { useAuthStore } from "@/store/auth.store";
import { useScheduleStore } from "@/store/shedule.store";

export default function Schedules() {
    const theme = useTheme();
    const role = useAuthStore((s) => s.role);
    const volunteerId = useAuthStore((s) => s.user?._id);

    const { setSchedules, deleteSchedule: deleteLocal, startEdit, clearEdit, editing } =
        useScheduleStore();

    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    /* ================= FETCH INFINITE SCHEDULES ================= */
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading,
        isFetching,
    } = useSchedulesQueryInfinite(searchQuery);

    const schedules = useMemo(
        () => data?.pages.flatMap((p: any) => p.data) ?? [],
        [data]
    );

    /* ================= DELETE API ================= */
    const deleteMutation = useDeleteScheduleMutation({
        onSuccess: (_, id) => deleteLocal(id),
    });

    const assignMutation = useAssignSchedule();
    const unassignMutation = useUnassignSchedule();


    /* ================= RENDER ================= */
    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
            {/* ================= SEARCH ================= */}
            <TextInput
                placeholder="Search schedules..."
                placeholderTextColor={theme.colors.border}
                value={searchQuery}
                onChangeText={(v) => setSearchQuery(v)}
                style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                    color: theme.colors.text,
                }}
            />

            {/* ================= LIST ================= */}
            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <FlatList
                    data={schedules}
                    keyExtractor={(item) => item._id}
                    refreshing={isFetching}
                    onRefresh={refetch}
                    onEndReached={() => hasNextPage && fetchNextPage()}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <ScheduleCard
                            item={item}
                            role={role as any}
                            onEdit={() => {
                                startEdit(item);
                                setOpen(true);
                            }}
                            onDelete={() => deleteMutation.mutate(item._id)}
                            onAssign={() =>
                                assignMutation.mutate(item._id)
                            }
                            onUnassign={() =>
                                unassignMutation.mutate(item._id)
                            }
                        />

                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListFooterComponent={() =>
                        isFetchingNextPage ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : null
                    }
                />
            )}

            {/* ================= FLOAT BUTTON (ADMIN ONLY) ================= */}
            {role === "admin" && (
                <TouchableOpacity
                    onPress={() => setOpen(true)}
                    style={{
                        position: "absolute",
                        right: 24,
                        bottom: 24,
                        backgroundColor: theme.colors.primary,
                        borderRadius: 40,
                        padding: 18,
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 22 }}>＋</Text>
                </TouchableOpacity>
            )}

            {/* ================= MODAL FORM ================= */}
            <ScheduleFormModal
                visible={open}
                editing={editing}
                onClose={() => {
                    clearEdit();
                    setOpen(false);
                }}
            />
        </View>
    );
}
