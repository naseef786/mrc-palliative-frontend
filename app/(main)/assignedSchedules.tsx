// screens/AssignedSchedules.tsx
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { ScheduleCard } from "@/components/ScheduleCard/ScheduleCard";
import { useAssignedSchedules, useUpdateAssignedScheduleStatus } from "@/hooks/useAssignedSchedules";
import { useAssignedScheduleStore } from "@/store/assignedSchedules.store";
import { Schedule } from "@/store/shedule.store";

export default function AssignedSchedulesScreen() {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState("");

    const { schedules, updateLocalStatus } = useAssignedScheduleStore();
    const updateStatusMutation = useUpdateAssignedScheduleStatus();

    // Fetch schedules
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        isLoading,
        refetch,
    } = useAssignedSchedules(searchQuery);

    // Flatten and sort schedules by date
    const sortedSchedules: Schedule[] = useMemo(() => {
        const all = data?.pages.flatMap((p: any) => p.data) ?? [];
        return all
            .filter((s: any) => s.info.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data, searchQuery]);

    // Bottom sheet
    const sheetRef = useRef<BottomSheet>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const snapPoints = ["70%", "90%"];

    const openSheet = useCallback((schedule: Schedule) => {
        setSelectedSchedule(schedule);
        sheetRef.current?.expand();
    }, []);

    const closeSheet = useCallback(() => {
        setSelectedSchedule(null);
        sheetRef.current?.close();
    }, []);

    // Update status
    const handleStatusChange = (status: "pending" | "in-progress" | "completed" | "expired") => {
        if (!selectedSchedule) return;
        sheetRef?.current?.close()
        updateStatusMutation.mutate({ id: selectedSchedule._id, status });
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
            {/* Search */}
            <TextInput
                placeholder="Search schedules..."
                placeholderTextColor={theme.colors.border}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    color: theme.colors.text,
                }}
            />

            {/* Schedule list */}
            <FlatList
                data={sortedSchedules}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <ScheduleCard
                        item={item}
                        onPress={() => openSheet(item)}
                    />
                )}
                onEndReached={() => hasNextPage && fetchNextPage()}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        colors={[theme.colors.primary]}
                    />
                }
                ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            {/* Bottom Sheet */}
            <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={{ backgroundColor: theme.colors.card, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                onClose={closeSheet}
            >
                <BottomSheetView style={{ padding: 16 }}>
                    {selectedSchedule && (
                        <>
                            <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.colors.text }}>
                                {selectedSchedule.info}
                            </Text>
                            <Text style={{ color: theme.colors.text, marginTop: 8 }}>Remarks: {selectedSchedule.remarks || "-"}</Text>
                            <Text style={{ color: theme.colors.text, marginTop: 4 }}>Message: {selectedSchedule.message || "-"}</Text>
                            <Text style={{ color: theme.colors.text, marginTop: 4 }}>Status: {selectedSchedule.status}</Text>
                            <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                                Assigned Date: {new Date(selectedSchedule.date).toLocaleString()}
                            </Text>

                            {/* Status buttons */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", alignItems: 'center', }}>
                                {["pending", "in-progress", "completed", "expired"].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        onPress={() => handleStatusChange(status as any)}
                                        style={{
                                            backgroundColor: selectedSchedule.status === status ? theme.colors.primary : theme.colors.border,
                                            padding: 12,
                                            borderRadius: 8,
                                            width: "30%",
                                            marginTop: 10
                                        }}
                                    >
                                        <Text style={{ color: "#fff", textAlign: "center", fontSize: 12 }}>
                                            {status.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity onPress={closeSheet} style={{ marginTop: 16 }}>
                                <Text style={{ color: theme.colors.primary, textAlign: "center" }}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </BottomSheetView>
            </BottomSheet>
        </View>
    );
}
