import { Patient } from "@/store/patient.store";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Patient, "id">) => void;
    editing?: Patient | null;
}

export function PatientFormModal({
    visible,
    onClose,
    onSubmit,
    editing,
}: Props) {
    const theme = useTheme();

    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [address, setAddress] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [medicalHistory, setMedicalHistory] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editing) {
            setName(editing.name);
            setDob(editing.dob);
            setAddress(editing.address);
            setEmergencyContact(editing.emergencyContact);
            setMedicalHistory(editing.medicalHistory || "");
        } else {
            reset();
        }
    }, [editing, visible]);

    const reset = () => {
        setName("");
        setDob("");
        setAddress("");
        setEmergencyContact("");
        setMedicalHistory("");
        setErrors({});
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = "Name is required";
        if (!dob.trim()) e.dob = "DOB is required";
        if (!emergencyContact.trim())
            e.emergencyContact = "Emergency contact required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = () => {
        if (!validate()) return;

        onSubmit({
            name,
            dob,
            address,
            emergencyContact,
            medicalHistory,
        });

        onClose();
        reset();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {editing ? "Update Patient" : "Add Patient"}
                    </Text>

                    <Input
                        label="Name"
                        value={name}
                        onChange={setName}
                        error={errors.name}
                    />
                    <Input
                        label="DOB"
                        value={dob}
                        onChange={setDob}
                        error={errors.dob}
                        placeholder="YYYY-MM-DD"
                    />
                    <Input
                        label="Emergency Contact"
                        value={emergencyContact}
                        onChange={setEmergencyContact}
                        error={errors.emergencyContact}
                    />
                    <Input
                        label="Address"
                        value={address}
                        onChange={setAddress}
                    />
                    <Input
                        label="Medical History"
                        value={medicalHistory}
                        onChange={setMedicalHistory}
                        multiline
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={submit}>
                            <Text style={styles.save}>
                                {editing ? "Update" : "Create"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function Input({
    label,
    value,
    onChange,
    error,
    multiline,
    placeholder,
}: any) {
    const theme = useTheme();

    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ color: theme.colors.text, marginBottom: 4 }}>
                {label}
            </Text>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.text + "99"}
                multiline={multiline}
                style={[
                    styles.input,
                    {
                        color: theme.colors.text,
                        borderColor: error ? "#F44336" : theme.colors.border,
                    },
                ]}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 16,
    },
    card: {
        borderRadius: 20,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
    error: {
        color: "#F44336",
        marginTop: 4,
        fontSize: 12,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    cancel: {
        color: "#999",
        fontSize: 16,
    },
    save: {
        color: "#2196F3",
        fontSize: 16,
        fontWeight: "600",
    },
});
