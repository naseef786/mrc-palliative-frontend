// make sure this path is correct
import { UI } from "@/ui/styles";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const createVolunteer = useCreateVolunteer();
  const updateVolunteer = useUpdateVolunteer();

  const loading = (createVolunteer as any).isLoading || (updateVolunteer as any).isLoading;

  useEffect(() => {
    if (volunteer) {
      setName(volunteer.name);
      setEmail(volunteer.email);
      setPhone(volunteer.phone || "");
      setPassword(""); // password not needed for update
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    }
  }, [volunteer]);

  const submit = async () => {
    try {
      if (volunteer) {
        // Update existing volunteer
        await updateVolunteer.mutateAsync({
          id: volunteer._id,
          data: { name, email, phone },
        });
      } else {
        // Create new volunteer
        await createVolunteer.mutateAsync({
          name,
          email,
          phone,
          password,
          role: "volunteer",
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to save volunteer");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center" }}>
        <View style={[UI.card, { backgroundColor: theme.colors.card, margin: 16 }]}>
          <Text style={[UI.title, { color: theme.colors.text }]}>
            {volunteer ? "Edit Volunteer" : "Add Volunteer"}
          </Text>

          <TextInput
            placeholderTextColor={theme.colors.text}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          />

          <TextInput
            placeholderTextColor={theme.colors.text}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          />

          <TextInput
            placeholderTextColor={theme.colors.text}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          />

          {!volunteer && (
            <TextInput
              placeholderTextColor={theme.colors.text}
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              style={[UI.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            />
          )}

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
