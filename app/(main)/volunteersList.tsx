import { Volunteer } from "@/api/volunteer.api";
import Card from "@/components/Card";
import VolunteerFormModal from "@/components/VolunteersList/VolunteerFormModal";
import { useDeleteVolunteer, useVolunteers } from "@/hooks/useVolunteers";
import { UI } from "@/ui/styles";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function VolunteersList() {
    const theme = useTheme();
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Volunteer | null>(null);
    const deleteMutation = useDeleteVolunteer();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        isRefetching,
        refetch,
        status,
    } = useVolunteers();

    // Flatten paginated data
    const volunteers = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    // BottomSheet ref and state
    const sheetRef = useRef<BottomSheet>(null);
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const snapPoints = useMemo(() => ["35%", "70%"], []);

    const closeSheet = useCallback(() => setSelectedVolunteer(null), []);
    const removeVolunteer = () => {
        if (selectedVolunteer) {
            deleteMutation.mutate(selectedVolunteer._id);
            setSelectedVolunteer(null);
        }
        sheetRef.current?.close();
    };

    // Full-screen loading
    if (status === "pending") {
        return (
            <View style={[UI.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // Error fallback
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
                    data={volunteers.filter((v) =>
                        v.name.toLowerCase().includes(search.toLowerCase())
                    )}
                    keyExtractor={(i) => i._id}
                    onEndReached={() => {
                        if (hasNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={0.4}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={() => refetch()}
                            colors={[theme.colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        !isFetching ? (
                            <View style={{ padding: 32, alignItems: "center" }}>
                                <Text style={{ color: theme.colors.text }}>No volunteers found.</Text>
                            </View>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <Card>
                            <Pressable onPress={() => setSelectedVolunteer(item)}>
                                <Text style={[UI.title, { color: theme.colors.text }]}>{item.name}</Text>
                                <Text style={{ color: theme.colors.text }}>{item.email}</Text>
                            </Pressable>
                        </Card>
                    )}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <View style={{ padding: 16 }}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            </View>
                        ) : null
                    }
                />

                {/* Floating Add Button */}
                <TouchableOpacity
                    style={[UI.fab, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                        setEditing(null);
                        setFormOpen(true);
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 30 }}>＋</Text>
                </TouchableOpacity>

                {/* Volunteer Form Modal */}
                <VolunteerFormModal
                    visible={formOpen}
                    volunteer={editing}
                    onClose={() => setFormOpen(false)}
                    onSuccess={() => refetch()}
                />

                {/* Bottom Sheet */}
                <BottomSheet
                    ref={sheetRef}
                    index={selectedVolunteer !== null ? 0 : -1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    backgroundStyle={{ backgroundColor: theme.colors.card, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                    onClose={closeSheet}
                >
                    <BottomSheetView style={{ padding: 16 }}>
                        <ScrollView>
                            {selectedVolunteer && (
                                <>
                                    <Text style={[UI.title, { color: theme.colors.text, marginBottom: 8 }]}>
                                        {selectedVolunteer.name}
                                    </Text>

                                    {/* List all properties */}
                                    <View style={{ marginBottom: 8 }}>
                                        <Text style={{ color: theme.colors.text, fontWeight: "600" }}>Email:</Text>
                                        <Text style={{ color: theme.colors.text }}>{selectedVolunteer.email}</Text>
                                    </View>

                                    <View style={{ marginBottom: 8 }}>
                                        <Text style={{ color: theme.colors.text, fontWeight: "600" }}>Phone:</Text>
                                        <Text style={{ color: theme.colors.text }}>{selectedVolunteer.phone}</Text>
                                    </View>

                                    <View style={{ marginBottom: 8 }}>
                                        <Text style={{ color: theme.colors.text, fontWeight: "600" }}>Total Services:</Text>
                                        <Text style={{ color: theme.colors.text }}>{selectedVolunteer.totalServices}</Text>
                                    </View>

                                    <View style={{ marginBottom: 8 }}>
                                        <Text style={{ color: theme.colors.text, fontWeight: "600" }}>Address:</Text>
                                        <Text style={{ color: theme.colors.text }}>{selectedVolunteer.address}</Text>
                                    </View>

                                    {/* <View style={{ marginBottom: 8 }}>
                                        <Text style={{ color: theme.colors.text, fontWeight: "600" }}>Notes:</Text>
                                        <Text style={{ color: theme.colors.text }}>{selectedVolunteer?.notes}</Text>
                                    </View> */}

                                    <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
                                        <TouchableOpacity
                                            style={[UI.primaryBtn, { backgroundColor: theme.colors.primary, width: "45%" }]}
                                            onPress={() => {
                                                setEditing(selectedVolunteer);
                                                setFormOpen(true);
                                            }}
                                        >
                                            <Text style={UI.btnText}>Edit</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[UI.dangerBtn, { width: "45%" }]} onPress={removeVolunteer}>
                                            <Text style={UI.btnText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => closeSheet()}
                                        style={{ marginTop: 20 }}
                                    >
                                        <Text style={{ textAlign: "center", marginTop: 10 }}>Close</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}
