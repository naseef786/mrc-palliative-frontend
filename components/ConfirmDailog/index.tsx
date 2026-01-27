import { useTheme } from "@react-navigation/native";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ConfirmDialogProps {
    visible: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    visible,
    title = "Confirm",
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const theme = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}
            >
                <View
                    style={{
                        width: "100%",
                        backgroundColor: theme.colors.card,
                        borderRadius: 16,
                        padding: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: theme.colors.text,
                            marginBottom: 8,
                        }}
                    >
                        {title}
                    </Text>

                    <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
                        {message}
                    </Text>

                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <TouchableOpacity onPress={onCancel} style={{ marginRight: 16 }}>
                            <Text style={{ color: theme.colors.text }}>
                                {cancelText}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onConfirm}>
                            <Text style={{ color: theme.colors.notification, fontWeight: "600" }}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
