import Card from "@/components/Card";
import { PatientFormModal } from "@/components/PatientFormModal";
import { PatientSkeleton } from "@/components/skeletons/PatientCardSkeleton";
import {
  useDeletePatient,
  usePatients,
} from "@/hooks/usePatients";
import { UI } from "@/ui/styles";
import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
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
      p?.name.toLowerCase().includes(search.toLowerCase())
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
        data={patients}
        keyExtractor={(item) => item._id}
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
          <Card >
            <Text style={[UI.name, { color: theme.colors.text }]}>
              {item?.name}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              DOB: {item.dob}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              Contact: {item.emergencyContact}
            </Text>

            <View style={UI.row}>
              <TouchableOpacity onPress={() => openEdit(item)}>
                <Text style={UI.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteMutation.mutate(item._id)}
              >
                <Text style={UI.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
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
    </View>
  );
}

