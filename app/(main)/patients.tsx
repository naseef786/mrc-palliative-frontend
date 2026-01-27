import ReusableBottomSheet, { BottomSheetRef } from "@/components/BottomSheet";
import Card from "@/components/CardWrapper/Card";
import { ConfirmDialog } from "@/components/ConfirmDailog";
import { PatientFormModal } from "@/components/PatientFormModal/PatientFormModal";
import { PatientSkeleton } from "@/components/Skeletons/PatientCardSkeleton";
import {
  useDeletePatient,
  usePatients,
} from "@/hooks/usePatients";
import { UI } from "@/ui/styles";
import { useTheme } from "@react-navigation/native";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export interface Patient {
  _id: string;
  name: string;
  dob: string;
  address: string;
  emergencyContact: string;
  medicalHistory?: string;
}

export default function PatientList() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = usePatients();
  const sheetRef = useRef<BottomSheetRef>(null);
  const deleteMutation = useDeletePatient();

  const patients = useMemo(() => {
    const all = data?.pages.flatMap((p) => p.data) ?? [];
    return all.filter((p) =>
      p?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const openCreate = () => {
    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (p: Patient) => {
    sheetRef?.current?.close()
    setEditing(p);
    setModalVisible(true);
  };
  const openSheet = (patient: any) => {
    setSelectedPatient(patient);
    setSheetVisible(true);
  };

  const closeSheet = () => {
    sheetRef?.current?.close();
    setSheetVisible(false);
  };
  if (isLoading) {
    return (
      <View style={UI.container}>
        {[...Array(6)].map((_, i) => (
          <PatientSkeleton key={i} />
        ))}
      </View>
    );
  }

  return (
    <View style={[UI.container, { backgroundColor: theme.colors.background }]}>

      <TextInput
        placeholder="Search patients"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={theme.colors.text + "99"}
        style={[
          UI.search,
          { color: theme.colors.text, borderColor: theme.colors.border },
        ]}
      />

      <FlatList
        data={patients || []}
        keyExtractor={(item) => item?._id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={() => {
          refetch()
        }}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator /> : null
        }
        renderItem={({ item }) => (
          <Card  >
            <TouchableOpacity onPress={() => openSheet(item)}>

              <Text style={[UI.name, { color: theme.colors.text }]}>
                {item?.name}
              </Text>
              <Text style={{ color: theme.colors.text }}>
                DOB: {item.dob}
              </Text>
              <Text style={{ color: theme.colors.text }}>
                Contact: {item.emergencyContact}
              </Text>


            </TouchableOpacity>
          </Card>
        )}
      />


      <PatientFormModal
        visible={modalVisible}
        editing={editing}
        onClose={() => setModalVisible(false)}
      />
      <TouchableOpacity
        style={[UI.fab, { backgroundColor: theme.colors.primary }]}
        onPress={openCreate}
      >
        <Text style={{ color: "#fff", fontSize: 30 }}>＋</Text>
      </TouchableOpacity>

      {/* ================== Bottom Sheet ================== */}
      {selectedPatient && (
        <ReusableBottomSheet
          ref={sheetRef}
          title={selectedPatient.name}
          isVisible={sheetVisible}
          onClose={closeSheet}
          content={
            <View>
              <Text style={{ color: theme.colors.text }}>DOB: {selectedPatient.dob}</Text>
              <Text style={{ color: theme.colors.text }}>Address: {selectedPatient.address}</Text>
              <Text style={{ color: theme.colors.text }}>Emergency Contact: {selectedPatient.emergencyContact}</Text>
              {selectedPatient.medicalHistory && (
                <Text style={{ color: theme.colors.text }}>Medical History: {selectedPatient.medicalHistory}</Text>
              )}
            </View>
          }
          actions={[
            {
              label: "Edit", onPress: () => {
                closeSheet()
                openEdit(selectedPatient)
              }, type: "primary"
            },
            {
              label: "Delete",
              type: "danger",
              onPress: () => {
                closeSheet();
                setConfirmVisible(true);
              },
            }
          ]}
        />
      )}

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete Patient"
        message={`Are you sure you want to delete ${selectedPatient?.name}? This action cannot be undone.`}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          deleteMutation.mutate(selectedPatient?._id);
          setConfirmVisible(false);
        }}
      />

    </View>
  );
}




