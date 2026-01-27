// components/PatientFormModal/PatientFormModal.tsx
import { useCreatePatient, useUpdatePatient } from "@/hooks/usePatients";
import { UI } from "@/ui/styles";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Props {
  visible: boolean;
  onClose: () => void;
  editing?: any | null;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function PatientFormModal({ visible, onClose, editing }: Props) {
  const theme = useTheme();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
    bloodGroup: "", // NEW FIELD
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        dob: editing.dob || "",
        address: editing.address || "",
        emergencyContact: editing.emergencyContact || "",
        medicalHistory: editing.medicalHistory || "",
        bloodGroup: editing.bloodGroup || "",
      });
    } else {
      reset();
    }
  }, [editing, visible]);

  const reset = () => {
    setForm({
      name: "",
      dob: "",
      address: "",
      emergencyContact: "",
      medicalHistory: "",
      bloodGroup: "",
    });
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Required";
    if (!form.dob) e.dob = "Required";
    if (!form.emergencyContact) e.emergencyContact = "Required";
    if (!form.bloodGroup) e.bloodGroup = "Select blood group";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    if (editing) {
      await updateMutation.mutateAsync({
        id: editing._id,
        data: form,
      });
    } else {
      await createMutation.mutateAsync(form);
    }

    onClose();
    reset();
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={UI.overlay}>
        <View style={[UI.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[UI.title, { color: theme.colors.text }]}>
            {editing ? "Update Patient" : "Add Patient"}
          </Text>

          {/* Fields */}
          {["name", "dob", "emergencyContact", "address", "medicalHistory"].map(
            (key) => (
              <View key={key} style={{ marginBottom: 12 }}>
                <Text style={{ color: theme.colors.text, marginBottom: 4 }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <TextInput
                  value={(form as any)[key]}
                  onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                  style={[
                    UI.input,
                    {
                      borderColor: errors[key] ? "#F44336" : theme.colors.border,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder={`Enter ${key}`}
                  placeholderTextColor={theme.colors.text + "88"}
                />
                {errors[key] && <Text style={UI.error}>{errors[key]}</Text>}
              </View>
            )
          )}

          {/* Blood Group Picker */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: theme.colors.text, marginBottom: 4 }}>
              Blood Group
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: errors.bloodGroup ? "#F44336" : theme.colors.border,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <Picker
                selectedValue={form.bloodGroup}
                onValueChange={(v) => setForm((p) => ({ ...p, bloodGroup: v }))}
                style={{ color: theme.colors.text }}
                dropdownIconColor={theme.colors.text}
              >
                <Picker.Item label="Select blood group" value="" />
                {BLOOD_GROUPS.map((bg) => (
                  <Picker.Item key={bg} label={bg} value={bg} />
                ))}
              </Picker>
            </View>
            {errors.bloodGroup && <Text style={UI.error}>{errors.bloodGroup}</Text>}
          </View>

          {/* Actions */}
          <View style={UI.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={UI.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={submit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <Text style={UI.save}>{editing ? "Update" : "Create"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
