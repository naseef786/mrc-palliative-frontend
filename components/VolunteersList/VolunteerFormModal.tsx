import { UI } from "@/ui/styles";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Volunteer } from "@/api/volunteer.api";
import { useCreateVolunteer, useUpdateVolunteer } from "@/hooks/useVolunteers";

interface Props {
  visible: boolean;
  volunteer?: Volunteer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VolunteerFormModal({
  visible,
  volunteer,
  onClose,
  onSuccess,
}: Props) {
  const theme = useTheme();

  // =================== Volunteer Fields ===================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [totalServices, setTotalServices] = useState("");

  const createVolunteer = useCreateVolunteer();
  const updateVolunteer = useUpdateVolunteer();
  const loading =
    (createVolunteer as any).isLoading || (updateVolunteer as any).isLoading;

  // =================== Prefill for edit ===================
  useEffect(() => {
    if (volunteer) {
      setName(volunteer.name || "");
      setEmail(volunteer.email || "");
      setPhone(volunteer.phone || "");
      setPassword(""); // password not needed for update
      setAddress(volunteer.address || "");
      // setNotes(volunteer.notes || "");
      setTotalServices(volunteer.totalServices?.toString() || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setAddress("");
      // setNotes("");
      setTotalServices("");
    }
  }, [volunteer]);

  // =================== Submit ===================
  const submit = async () => {
    try {
      const data: any = { name, email, phone, address, notes };
      if (totalServices) data.totalServices = Number(totalServices);
      if (!volunteer) data.password = password;

      if (volunteer) {
        // Update
        await updateVolunteer.mutateAsync({ id: volunteer._id, data });
      } else {
        // Create
        await createVolunteer.mutateAsync(data);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to save volunteer");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center" }}
      >
        <View style={[UI.card, { backgroundColor: theme.colors.card, margin: 16 }]}>
          <Text style={[UI.title, { color: theme.colors.text, marginBottom: 12 }]}>
            {volunteer ? "Edit Volunteer" : "Add Volunteer"}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              placeholder="Name"
              placeholderTextColor={theme.colors.text + "99"}
              value={name}
              onChangeText={setName}
              style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor={theme.colors.text + "99"}
              value={email}
              onChangeText={setEmail}
              style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            />

            <TextInput
              placeholder="Phone"
              placeholderTextColor={theme.colors.text + "99"}
              value={phone}
              onChangeText={setPhone}
              style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            />

            {!volunteer && (
              <TextInput
                placeholder="Password"
                placeholderTextColor={theme.colors.text + "99"}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              />
            )}

            <TextInput
              placeholder="Address"
              placeholderTextColor={theme.colors.text + "99"}
              value={address}
              onChangeText={setAddress}
              style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            />

            <TextInput
              placeholder="Notes"
              placeholderTextColor={theme.colors.text + "99"}
              value={notes}
              onChangeText={setNotes}
              multiline
              style={[
                UI.input,
                { borderColor: theme.colors.border, color: theme.colors.text, height: 80, textAlignVertical: "top" },
              ]}
            />

            <TextInput
              placeholder="Total Services"
              placeholderTextColor={theme.colors.text + "99"}
              value={totalServices}
              onChangeText={setTotalServices}
              keyboardType="numeric"
              style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            />
          </ScrollView>

          <View style={UI.actions}>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Text style={UI.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={submit} disabled={loading}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={UI.save}>{volunteer ? "Update" : "Create"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
