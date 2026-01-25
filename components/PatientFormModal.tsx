import { useCreatePatient, useUpdatePatient } from "@/hooks/usePatients";
import { UI } from "@/ui/styles";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface Props {
    visible: boolean;
    onClose: () => void;
    editing?: any | null;
}

export function PatientFormModal({ visible, onClose, editing }: Props) {
    const theme = useTheme();

    const [form, setForm] = useState({
        name: "",
        dob: "",
        address: "",
        emergencyContact: "",
        medicalHistory: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const createMutation = useCreatePatient();
    const updateMutation = useUpdatePatient();

    useEffect(() => {
        if (editing) {
            setForm({
                name: editing.name,
                dob: editing.dob,
                address: editing.address,
                emergencyContact: editing.emergencyContact,
                medicalHistory: editing.medicalHistory ?? "",
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
        });
        setErrors({});
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name) e.name = "Required";
        if (!form.dob) e.dob = "Required";
        if (!form.emergencyContact) e.emergencyContact = "Required";
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

                    {["name", "dob", "emergencyContact", "address", "medicalHistory"].map(
                        (key) => (
                            <View key={key} style={{ marginBottom: 12 }}>
                                <Text style={{ color: theme.colors.text }}>{key}</Text>
                                <TextInput
                                    value={(form as any)[key]}
                                    onChangeText={(v) =>
                                        setForm((p) => ({ ...p, [key]: v }))
                                    }
                                    style={[
                                        UI.input,
                                        {
                                            borderColor: errors[key]
                                                ? "#F44336"
                                                : theme.colors.border,
                                            color: theme.colors.text,
                                        },
                                    ]}
                                />
                                {errors[key] && (
                                    <Text style={UI.error}>{errors[key]}</Text>
                                )}
                            </View>
                        )
                    )}

                    <View style={UI.actions}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={UI.cancel}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={submit} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator />
                            ) : (
                                <Text style={UI.save}>
                                    {editing ? "Update" : "Create"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


