import { useScheduleStore } from "@/store/shedule.store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Errors {
    patientName?: string;
    task?: string;
    date?: string;
}

export function ScheduleFormModal({ visible, onClose, editing }: any) {
    const theme = useTheme();
    const add = useScheduleStore((s) => s.addSchedule);
    const update = useScheduleStore((s) => s.updateSchedule);

    const [patientName, setPatientName] = useState("");
    const [task, setTask] = useState("");
    const [date, setDate] = useState<Date>(new Date());

    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (editing) {
            setPatientName(editing.patientName);
            setTask(editing.task);
            setDate(new Date(editing.date));
        } else {
            setPatientName("");
            setTask("");
            setDate(new Date());
        }
        setErrors({});
    }, [editing, visible]);

    // 🔍 Validation
    const validate = () => {
        const newErrors: Errors = {};

        if (!patientName.trim() || patientName.length < 2) {
            newErrors.patientName = "Patient name must be at least 2 characters";
        }

        if (!task.trim() || task.length < 3) {
            newErrors.task = "Task must be at least 3 characters";
        }

        if (date.getTime() <= Date.now()) {
            newErrors.date = "Schedule date must be in the future";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = () => {
        if (!validate()) return;

        const payload = {
            patientName,
            task,
            date: date.toISOString(),
            status: editing ? editing.status : "pending",
        };

        editing ? update(editing.id, payload) : add(payload as any);
        onClose();
    };

    const inputStyle = (error?: string) => [
        styles.input,
        {
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            borderColor: error ? "#EF4444" : theme.colors.border,
        },
    ];

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {editing ? "Edit Schedule" : "New Schedule"}
                    </Text>

                    {/* Patient Name */}
                    <TextInput
                        placeholder="Patient name"
                        placeholderTextColor={theme.colors.border}
                        value={patientName}
                        onChangeText={(v) => {
                            setPatientName(v);
                            if (errors.patientName)
                                setErrors((e) => ({ ...e, patientName: undefined }));
                        }}
                        style={inputStyle(errors.patientName)}
                    />
                    {errors.patientName && (
                        <Text style={styles.error}>{errors.patientName}</Text>
                    )}

                    {/* Task */}
                    <TextInput
                        placeholder="Task description"
                        placeholderTextColor={theme.colors.border}
                        value={task}
                        onChangeText={(v) => {
                            setTask(v);
                            if (errors.task)
                                setErrors((e) => ({ ...e, task: undefined }));
                        }}
                        style={inputStyle(errors.task)}
                    />
                    {errors.task && (
                        <Text style={styles.error}>{errors.task}</Text>
                    )}

                    {/* Date */}
                    <TouchableOpacity
                        onPress={() => setShowDate(true)}
                        style={[
                            styles.selector,
                            {
                                borderColor: errors.date
                                    ? "#EF4444"
                                    : theme.colors.border,
                            },
                        ]}
                    >
                        <Text style={{ color: theme.colors.text }}>
                            📅 {date.toDateString()}
                        </Text>
                    </TouchableOpacity>

                    {/* Time */}
                    <TouchableOpacity
                        onPress={() => setShowTime(true)}
                        style={[
                            styles.selector,
                            {
                                borderColor: errors.date
                                    ? "#EF4444"
                                    : theme.colors.border,
                            },
                        ]}
                    >
                        <Text style={{ color: theme.colors.text }}>
                            ⏰{" "}
                            {date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </TouchableOpacity>

                    {errors.date && (
                        <Text style={styles.error}>{errors.date}</Text>
                    )}

                    {/* Pickers */}
                    {showDate && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === "ios" ? "inline" : "default"}
                            onChange={(_, selected) => {
                                setShowDate(false);
                                selected && setDate(selected);
                            }}
                        />
                    )}

                    {showTime && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            display="default"
                            onChange={(_, selected) => {
                                setShowTime(false);
                                selected && setDate(selected);
                            }}
                        />
                    )}

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={{ color: theme.colors.border }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={submit}
                            style={[
                                styles.primaryBtn,
                                { backgroundColor: theme.colors.primary },
                            ]}
                        >
                            <Text style={styles.primaryText}>
                                {editing ? "Update" : "Create"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        borderRadius: 20,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        fontSize: 15,
        marginBottom: 4,
    },
    selector: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginTop: 8,
    },
    error: {
        color: "#EF4444",
        fontSize: 12,
        marginBottom: 6,
        marginLeft: 4,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        alignItems: "center",
    },
    primaryBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    primaryText: {
        color: "#fff",
        fontWeight: "600",
    },
});

