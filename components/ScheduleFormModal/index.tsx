import { useCreateSchedule, useUpdateSchedule } from "@/hooks/useSchedules";
import { useScheduleStore } from "@/store/shedule.store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PatientDropdown } from "../PatientDropdown";

interface Errors {
    patient?: string;
    date?: string;
    info?: string;
}

export const ScheduleFormModal = ({ visible, onClose, editing }: any) => {
    const theme = useTheme();
    const { addSchedule, updateSchedule } = useScheduleStore();

    const [form, setForm] = useState<any>({
        patient: null,
        date: new Date(),
        info: "",
        remarks: "",
        message: "",
        otherInfo: "",
    });

    const [errors, setErrors] = useState<Errors>({});
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const reset = () => {
        setForm({
            patient: null,
            date: new Date(),
            info: "",
            remarks: "",
            message: "",
            otherInfo: "",
        });
        setErrors({});
    }
    /* ================= PREFILL ================= */
    useEffect(() => {
        if (editing) {
            setForm({
                patient: editing.patient,
                date: new Date(editing.date),
                info: editing.info,
                remarks: editing.remarks,
                message: editing.message,
                otherInfo: editing.otherInfo,
            });
        } else {
            reset
        }
        setErrors({});
    }, [editing, visible]);

    /* ================= CREATE/UPDATE MUTATIONS ================= */
    const createMutation = useCreateSchedule()

    const updateMutation = useUpdateSchedule()

    /* ================= VALIDATION ================= */
    const validate = () => {
        const e: Errors = {};

        if (!form.patient) e.patient = "Patient is required";
        if (!form.info?.trim() || form.info.length < 3) e.info = "Task must be at least 3 characters";
        if (!form.date || form.date.getTime() <= Date.now()) e.date = "Date must be in the future";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ================= SUBMIT ================= */
    const submit = async () => {
        if (!validate()) return;

        const payload = {
            patientId: form.patient._id,
            date: form.date.toISOString(),
            info: form.info.trim(),
            remarks: form.remarks.trim(),
            message: form.message.trim(),
            otherInfo: form.otherInfo.trim(),
        };

        if (editing) {
            await updateMutation.mutateAsync({ id: editing._id, data: payload });
        } else {
            await createMutation.mutateAsync(payload);
        }
        reset();
        onClose();
    };

    /* ================= UI HELPERS ================= */
    const inputStyle = (error?: string) => ({
        borderWidth: 1,
        borderColor: error ? "#EF4444" : theme.colors.border,
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        color: theme.colors.text,
    });

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: "#00000066", justifyContent: "flex-end" }}>
                <View
                    style={{
                        backgroundColor: theme.colors.card,
                        padding: 16,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        maxHeight: "90%",
                    }}
                >
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12, color: theme.colors.text }}>
                            {editing ? "Edit Schedule" : "Create Schedule"}
                        </Text>

                        {/* PATIENT DROPDOWN */}
                        <PatientDropdown
                            value={form.patient}
                            onSelect={(p: any) => setForm({ ...form, patient: p })}
                        />
                        {errors.patient && <Text style={{ color: "#EF4444", marginTop: 4 }}>{errors.patient}</Text>}

                        {/* DATE & TIME PICKER */}
                        <TouchableOpacity
                            onPress={() => setShowDate(true)}
                            style={inputStyle(errors.date)}
                        >
                            <Text style={{ color: theme.colors.text }}>
                                📅 {form.date.toDateString()}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowTime(true)}
                            style={inputStyle(errors.date)}
                        >
                            <Text style={{ color: theme.colors.text }}>
                                ⏰ {form.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                        </TouchableOpacity>
                        {errors.date && <Text style={{ color: "#EF4444", marginTop: 4 }}>{errors.date}</Text>}

                        {showDate && (
                            <DateTimePicker
                                value={form.date}
                                mode="date"
                                display={Platform.OS === "ios" ? "inline" : "default"}
                                onChange={(_, d) => {
                                    setShowDate(false);
                                    d && setForm({ ...form, date: new Date(d.setSeconds(0, 0)) });
                                }}
                            />
                        )}
                        {showTime && (
                            <DateTimePicker
                                value={form.date}
                                mode="time"
                                display="default"
                                onChange={(_, d) => {
                                    setShowTime(false);
                                    if (d) {
                                        const newDate = new Date(form.date);
                                        newDate.setHours(d.getHours(), d.getMinutes(), 0, 0);
                                        setForm({ ...form, date: newDate });
                                    }
                                }}
                            />
                        )}

                        {/* OTHER FIELDS */}
                        {["info", "remarks", "message", "otherInfo"].map((key) => (
                            <TextInput
                                key={key}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                value={form[key]}
                                placeholderTextColor={theme.colors.text + "88"}
                                onChangeText={(v) => setForm({ ...form, [key]: v })}
                                style={inputStyle(errors[key as keyof Errors])}
                            />
                        ))}

                        {/* ACTION BUTTONS */}
                        <TouchableOpacity
                            onPress={submit}
                            style={{
                                backgroundColor: theme.colors.primary,
                                padding: 14,
                                borderRadius: 12,
                                marginTop: 16,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "600" }}>
                                {editing ? "Update Schedule" : "Create Schedule"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            style={{ marginTop: 12, alignItems: "center" }}
                        >
                            <Text style={{ color: theme.colors.text }}>Cancel</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
