import { Patient } from "@/store/patient.store";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    item: Patient;
    role: "admin" | "volunteer";
    onEdit?: () => void;
    onDelete?: () => void;
}

export function PatientCard({ item, role, onEdit, onDelete }: Props) {
    const theme = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.name, { color: theme.colors.text }]}>
                {item.name}
            </Text>

            <Text style={{ color: theme.colors.text }}>
                DOB: {item.dob}
            </Text>

            <Text style={{ color: theme.colors.text }}>
                Emergency: {item.emergencyContact}
            </Text>

            {role === "admin" && (
                <View style={styles.actions}>
                    <TouchableOpacity onPress={onEdit}>
                        <Text style={styles.edit}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onDelete}>
                        <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    actions: {
        flexDirection: "row",
        gap: 20,
        marginTop: 12,
    },
    edit: {
        color: "#4CAF50",
        fontWeight: "500",
    },
    delete: {
        color: "#F44336",
        fontWeight: "500",
    },
});
