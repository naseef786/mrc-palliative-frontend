import { useTheme } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import ReusableBottomSheet from "@/components/BottomSheet";
import { ScheduleCard } from "@/components/ScheduleCard/ScheduleCard";
import { ScheduleFormModal } from "@/components/ScheduleFormModal";

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
    const { setSchedules, deleteSchedule: deleteLocal, startEdit, clearEdit, editing } =
        useScheduleStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);

    /* ================= FETCH SCHEDULES ================= */
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        isLoading,
        refetch,
    } = useSchedulesQueryInfinite(searchQuery);

    const schedules = useMemo(() => data?.pages.flatMap((p: any) => p.data) ?? [], [data]);

    /* ================= MUTATIONS ================= */
    const deleteMutation = useDeleteScheduleMutation({
        onSuccess: (_, id) => deleteLocal(id),
    });
    const assignMutation = useAssignSchedule();
    const unassignMutation = useUnassignSchedule();

    /* ================= HANDLERS ================= */
    const openSheet = (schedule: any) => setSelectedSchedule(schedule);
    const closeSheet = useCallback(() => setSelectedSchedule(null), []);

    const removeSchedule = () => {
        if (selectedSchedule) {
            deleteMutation.mutate(selectedSchedule._id);
            setSelectedSchedule(null);
        }
    };

    const editSchedule = () => {
        if (selectedSchedule) {
            startEdit(selectedSchedule);
            setFormOpen(true);
            setSelectedSchedule(null);
        }
    };

    /* ================= RENDER ================= */
    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
            {/* SEARCH */}
            <TextInput
                placeholder="Search schedules..."
                placeholderTextColor={theme.colors.border}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                    color: theme.colors.text,
                }}
            />

            {/* LIST */}
            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <FlatList
                    data={schedules || []}
                    keyExtractor={(item) => item?._id}
                    refreshControl={
                        <RefreshControl
                            refreshing={isFetching}
                            onRefresh={refetch}
                            colors={[theme.colors.primary]}
                        />
                    }
                    onEndReached={() => hasNextPage && fetchNextPage()}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <ScheduleCard
                            item={item}
                            role={role as any}
                            onEdit={() => { startEdit(item); setFormOpen(true); }}
                            onDelete={() => deleteMutation.mutate(item?._id)}
                            onAssign={() => assignMutation.mutate(item?._id)}
                            onUnassign={() => unassignMutation.mutate(item?._id)}
                            onPress={() => openSheet(item)}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListFooterComponent={() =>
                        isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null
                    }
                />
            )}

            {/* FLOAT BUTTON */}
            {role === "admin" && (
                <TouchableOpacity
                    onPress={() => { clearEdit(); setFormOpen(true); }}
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

            {/* MODAL FORM */}
            <ScheduleFormModal
                visible={formOpen}
                editing={editing}
                onClose={() => setFormOpen(false)}
            />

            {/* REUSABLE BOTTOM SHEET */}
            {selectedSchedule && (
                <ReusableBottomSheet
                    title="Schedule Details"
                    isVisible={!!selectedSchedule}
                    onClose={closeSheet}
                    content={
                        <View>
                            <View style={{ borderColor: theme?.colors?.primary, borderWidth: 1, padding: 10, borderRadius: 20, marginTop: 10 }}>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>Info: {selectedSchedule.info || "Not Available"}</Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>Remarks: {selectedSchedule.remarks || "Not Available"}</Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>Message: {selectedSchedule.message || "Not Available"}</Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>Status: {selectedSchedule.status}</Text>


                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                                    Assigned Volunteer: {selectedSchedule.assignedVolunteer?.name || "Not assigned"}
                                </Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                                    Assigned Date: {new Date(selectedSchedule.date).toLocaleString()}
                                </Text>
                            </View>
                            <View style={{ borderColor: theme?.colors?.primary, borderWidth: 1, padding: 10, borderRadius: 20, marginTop: 10 }}>
                                <Text style={{ color: theme.colors.text, marginTop: 0, fontWeight: 600 }}>Patient Details: </Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>Name: {selectedSchedule.patient?.name}</Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>age: {selectedSchedule.patient?.age}</Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>gender: {selectedSchedule.patient?.gender}</Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>phone: {selectedSchedule.patient?.phone}</Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>address: {selectedSchedule.patient?.address}</Text>
                                <Text style={{ color: theme.colors.text, marginTop: 4 }}>bloodGroup: {selectedSchedule.patient?.bloodGroup}</Text>
                            </View>
                        </View>
                    }
                    actions={role === "admin" ? [
                        { label: "Edit", onPress: editSchedule, type: "primary" },
                        { label: "Delete", onPress: removeSchedule, type: "danger" },
                    ] : undefined}
                />
            )}
        </View>
    );
}
