import { useTheme } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { ScheduleCard } from "@/components/ScheduleCard";
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
    const volunteerId = useAuthStore((s) => s.user?._id);

    const { setSchedules, deleteSchedule: deleteLocal, startEdit, clearEdit, editing } =
        useScheduleStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [formOpen, setFormOpen] = useState(false);

    /* ================= FETCH INFINITE SCHEDULES ================= */
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        isLoading,
        refetch,
    } = useSchedulesQueryInfinite(searchQuery);

    const schedules = useMemo(
        () => data?.pages.flatMap((p: any) => p.data) ?? [],
        [data]
    );

    /* ================= MUTATIONS ================= */
    const deleteMutation = useDeleteScheduleMutation({
        onSuccess: (_, id) => deleteLocal(id),
    });
    const assignMutation = useAssignSchedule();
    const unassignMutation = useUnassignSchedule();

    /* ================= BOTTOM SHEET ================= */
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%", "70%"], []);
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);

    const openSheet = (schedule: any) => setSelectedSchedule(schedule);
    const closeSheet = useCallback(() => setSelectedSchedule(null), []);

    const removeSchedule = () => {
        if (selectedSchedule) {
            deleteMutation.mutate(selectedSchedule._id);
            setSelectedSchedule(null);
        }
        sheetRef.current?.close();
    };

    const editSchedule = () => {
        if (selectedSchedule) {
            startEdit(selectedSchedule);
            setFormOpen(true);
            sheetRef.current?.close();
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
                            onEdit={() => {
                                startEdit(item);
                                setFormOpen(true);
                            }}
                            onDelete={() => deleteMutation.mutate(item?._id)}
                            onAssign={() => assignMutation.mutate(item?._id)}
                            onUnassign={() => unassignMutation.mutate(item?._id)}
                            onPress={() => openSheet(item)} // Open bottom sheet on press
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

            {/* FLOAT BUTTON FOR ADMIN */}
            {role === "admin" && (
                <TouchableOpacity
                    onPress={() => {
                        clearEdit();
                        setFormOpen(true);
                    }}
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

            {/* BOTTOM SHEET */}
            <BottomSheet
                ref={sheetRef}
                index={selectedSchedule ? 0 : -1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={{
                    backgroundColor: theme.colors.card,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                }}
                onClose={closeSheet}
            >
                <BottomSheetView style={{ padding: 16 }}>
                    {selectedSchedule && (
                        <>
                            <Text style={{ fontSize: 20, fontWeight: "700", color: theme.colors.text }}>
                                Schedule Details
                            </Text>
                            <Text style={{ color: theme.colors.text, marginTop: 8 }}>
                                Info: {selectedSchedule.info || "-"}
                            </Text>
                            <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                                Remarks: {selectedSchedule.remarks || "-"}
                            </Text>
                            <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                                Message: {selectedSchedule.message || "-"}
                            </Text>
                            <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                                Status: {selectedSchedule.status}
                            </Text>
                            <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                                Assigned Volunteer: {selectedSchedule.assignedVolunteer?.name || "Not assigned"}
                            </Text>
                            <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                                Date: {new Date(selectedSchedule.date).toLocaleString()}
                            </Text>

                            {/* ACTION BUTTONS */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        padding: 12,
                                        borderRadius: 8,
                                        width: "48%",
                                    }}
                                    onPress={editSchedule}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center" }}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "red",
                                        padding: 12,
                                        borderRadius: 8,
                                        width: "48%",
                                    }}
                                    onPress={removeSchedule}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center" }}>Delete</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={closeSheet} style={{ marginTop: 16 }}>
                                <Text style={{ textAlign: "center", marginTop: 8, color: theme.colors.primary }}>
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </BottomSheetView>
            </BottomSheet>
        </View>
    );
}
