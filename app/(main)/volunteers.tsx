import { Volunteer } from "@/api/volunteer.api";
import ReusableBottomSheet, { BottomSheetRef } from "@/components/BottomSheet";
import Card from "@/components/CardWrapper/Card";
import { ConfirmDialog } from "@/components/ConfirmDailog";
import VolunteerFormModal from "@/components/VolunteersList/VolunteerFormModal";
import { useDeleteVolunteer, useVolunteers } from "@/hooks/useVolunteers";
import { UI } from "@/ui/styles";
import { useTheme } from "@react-navigation/native";
import { useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function VolunteersList() {
    const theme = useTheme();
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Volunteer | null>(null);
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const deleteMutation = useDeleteVolunteer();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching, refetch, status } = useVolunteers();
    const [sheetVisible, setSheetVisible] = useState(false);
    const volunteers = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);
    const sheetRef = useRef<BottomSheetRef>(null);
    const removeVolunteer = () => {
        if (selectedVolunteer) {
            deleteMutation.mutate(selectedVolunteer._id);
            setSelectedVolunteer(null);
            setSheetVisible(false);
        }
        setConfirmVisible(false)
    };
    const closeSheet = () => {
        sheetRef?.current?.close();
        setSheetVisible(false)
    };
    const openSheet = (volunteer: any) => {
        setSelectedVolunteer(volunteer);
        setSheetVisible(!sheetVisible);
    }
    if (status === "pending") {
        return (
            <View style={[UI.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (status === "error") {
        return (
            <View style={[UI.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: theme.colors.text }}>Failed to load volunteers.</Text>
                <TouchableOpacity onPress={() => refetch()}>
                    <Text style={{ color: theme.colors.primary, marginTop: 8 }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={[UI.container, { backgroundColor: theme.colors.background }]}>
                <TextInput
                    placeholder="Search volunteers..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor={theme.colors.text + "99"}
                    style={[UI.search, { color: theme.colors.text, borderColor: theme.colors.border }]}
                    onSubmitEditing={() => refetch()}
                />

                <FlatList
                    data={volunteers.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))}
                    keyExtractor={(i) => i._id}
                    onEndReached={() => hasNextPage && fetchNextPage()}
                    onEndReachedThreshold={0.4}
                    refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[theme.colors.primary]} />}
                    ListEmptyComponent={
                        !isFetchingNextPage ? (
                            <View style={{ padding: 32, alignItems: "center" }}>
                                <Text style={{ color: theme.colors.text }}>No volunteers found.</Text>
                            </View>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <Card>
                            <Pressable onPress={() => openSheet(item)}>
                                <Text style={[UI.title, { color: theme.colors.text }]}>{item.name}</Text>
                                <Text style={{ color: theme.colors.text }}>{item.email}</Text>
                            </Pressable>
                        </Card>
                    )}
                    ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
                />

                <TouchableOpacity
                    style={[UI.fab, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                        setEditing(null);
                        setFormOpen(true);
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 30 }}>＋</Text>
                </TouchableOpacity>

                <VolunteerFormModal visible={formOpen} volunteer={editing} onClose={() => setFormOpen(false)} onSuccess={() => refetch()} />

                {selectedVolunteer && sheetVisible && (
                    <ReusableBottomSheet
                        ref={sheetRef}
                        title={selectedVolunteer.name}
                        isVisible={sheetVisible}
                        onClose={closeSheet}
                        content={
                            <View>
                                <Text style={{ color: theme.colors.text, marginBottom: 4 }}>Email: {selectedVolunteer.email}</Text>
                                <Text style={{ color: theme.colors.text, marginBottom: 4 }}>Phone: {selectedVolunteer.phone || "-"}</Text>
                                <Text style={{ color: theme.colors.text, marginBottom: 4 }}>Address: {selectedVolunteer.address || "-"}</Text>
                                <Text style={{ color: theme.colors.text, marginBottom: 4 }}>Total Services: {selectedVolunteer.totalServices ?? 0}</Text>
                                <Text style={{ color: theme.colors.text, marginBottom: 4 }}>Created At: {new Date(selectedVolunteer.createdAt).toLocaleDateString()}</Text>
                                <Text style={{ color: theme.colors.text, marginBottom: 4 }}>Updated At: {new Date(selectedVolunteer.updatedAt).toLocaleDateString()}</Text>
                            </View>
                        }
                        actions={[
                            { label: "Edit", onPress: () => { setEditing(selectedVolunteer); closeSheet(); setFormOpen(true); }, type: "primary" },
                            {
                                label: "Delete", onPress: () => {
                                    closeSheet();
                                    setConfirmVisible(true);

                                }, type: "danger"
                            },
                        ]}
                    />
                )}
            </View>
            <ConfirmDialog
                visible={confirmVisible}
                title="Delete Patient"
                message={`Are you sure you want to delete ${selectedVolunteer?.name}? This action cannot be undone.`}
                onCancel={() => setConfirmVisible(false)}
                onConfirm={() => {
                    removeVolunteer()
                }}
            />
        </GestureHandlerRootView>
    );
}
