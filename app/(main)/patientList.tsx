import { PatientCard } from "@/components/PatientCard";
import { PatientFormModal } from "@/components/PatientFormModal";
import { Patient, usePatientStore } from "@/store/patient.store";
import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  role: "admin" | "volunteer";
}

export default function PatientList({ role = "admin" }: Props) {
  const theme = useTheme();
  const { patients, addPatient, updatePatient, deletePatient } =
    usePatientStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Patient | null>(null);
  const openCreate = () => {
    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (patient: Patient) => {
    setEditing(patient);
    setModalVisible(true);
  };
  const filtered = useMemo(
    () =>
      patients.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [patients, search]
  );

  const handleAddMock = () => {
    addPatient({
      name: "John Doe",
      dob: "1990-05-12",
      address: "Dubai",
      emergencyContact: "+971 555 123456",
      medicalHistory: "Diabetes",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>
        Patients
      </Text>

      {/* Search */}
      <TextInput
        placeholder="Search by name"
        placeholderTextColor={theme.colors.text + "99"}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.search,
          { color: theme.colors.text, borderColor: theme.colors.border },
        ]}
      />

      {/* Admin Add Button */}
      {role === "admin" && (
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addText}>+ Add Patient</Text>
        </TouchableOpacity>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <PatientCard
            item={item}
            role={role}
            onEdit={() => openEdit(item)}
            onDelete={() => deletePatient(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: theme.colors.text, textAlign: "center" }}>
            No patients found
          </Text>
        }
      />
      <PatientFormModal
        visible={modalVisible}
        editing={editing}
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => {
          if (editing) {
            updatePatient(editing.id, data);
          } else {
            addPatient(data);
          }
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
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
  addText: {
    color: "#fff",
    fontWeight: "600",
  },
});
