import { deleteVolunteerApi, Volunteer } from "@/api/volunteer.api";
import { UI } from "@/ui/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface Props {
  volunteer: Volunteer | null;
  onClose: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

export default function VolunteerBottomSheet({ volunteer, onClose, onEdit, onDeleted }: Props) {
  const theme = useTheme();
  const sheetRef = useRef<BottomSheet>(null);

  if (!volunteer) return null;

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const remove = useCallback(async () => {
    try {
      await deleteVolunteerApi(volunteer._id);
      onDeleted();
      onClose();
    } catch {
      Alert.alert("Error", "Delete failed");
    }
  }, [volunteer, onClose, onDeleted]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.colors.card, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      onClose={onClose}
    >
      <View style={{ padding: 16 }}>
        <Text style={[UI.title, { color: theme.colors.text }]}>{volunteer.name}</Text>
        <Text style={{ color: theme.colors.text }}>{volunteer.email}</Text>
        <Text style={{ color: theme.colors.text }}>{volunteer.phone}</Text>
        <Text style={{ color: theme.colors.text }}>Total Services: {volunteer.totalServices}</Text>

        <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={[UI.primaryBtn, { backgroundColor: theme.colors.primary, width: "45%" }]}
            onPress={onEdit}
          >
            <Text style={UI.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[UI.dangerBtn, { width: "45%" }]} onPress={remove}>
            <Text style={UI.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onClose}>
          <Text style={{ textAlign: "center", marginTop: 10 }}>Close</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
