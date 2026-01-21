import { PatientFormModal } from "@/components/PatientFormModal";
import { PatientSkeleton } from "@/components/skeletons/PatientCardSkeleton";
import {
  useDeletePatient,
  usePatients,
} from "@/hooks/usePatients";
import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = usePatients();

  const deleteMutation = useDeletePatient();

  const patients = useMemo(() => {
    const all = data?.pages.flatMap((p) => p.data) ?? [];
    return all.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const openCreate = () => {
    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (p: Patient) => {
    setEditing(p);
    setModalVisible(true);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {[...Array(6)].map((_, i) => (
          <PatientSkeleton key={i} />
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>
        Patients
      </Text>

      <TextInput
        placeholder="Search patients"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={theme.colors.text + "99"}
        style={[
          styles.search,
          { color: theme.colors.text, borderColor: theme.colors.border },
        ]}
      />

      <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
        <Text style={styles.addText}>+ Add Patient</Text>
      </TouchableOpacity>

      <FlatList
        data={patients}
        keyExtractor={(item) => item._id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={() => refetch()}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator /> : null
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              DOB: {item.dob}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              Contact: {item.emergencyContact}
            </Text>

            <View style={styles.row}>
              <TouchableOpacity onPress={() => openEdit(item)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteMutation.mutate(item._id)}
              >
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />


      <PatientFormModal
        visible={modalVisible}
        editing={editing}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "600" },
  card: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: "700" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  edit: { color: "#2196F3" },
  delete: { color: "#F44336" },
});
