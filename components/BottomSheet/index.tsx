import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
} from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

/* ================= Types ================= */

export interface BottomSheetRef {
    open: () => void;
    close: () => void;
}

interface Action {
    label: string;
    onPress: () => void;
    type?: "primary" | "danger" | "default";
    disabled?: boolean;
}

interface Props {
    title: string;
    content: React.ReactNode;
    actions?: Action[];
    isVisible: boolean;
    onClose: () => void;
    snapPoints?: string[];
}

/* ================= Component ================= */

const ReusableBottomSheet = forwardRef<BottomSheetRef, Props>(
    (
        {
            title,
            content,
            actions = [],
            isVisible,
            onClose,
            snapPoints = ["90%", "100%"],
        },
        ref
    ) => {
        const theme = useTheme();
        const sheetRef = useRef<BottomSheet>(null);

        /* ---------- Expose methods to parent ---------- */
        useImperativeHandle(ref, () => ({
            open: () => sheetRef.current?.expand(),
            close: () => sheetRef.current?.close(),
        }));

        const handleClose = useCallback(() => {
            onClose();
        }, [onClose]);

        return (
            <BottomSheet
                ref={sheetRef}
                index={isVisible ? 0 : -1}
                snapPoints={snapPoints}
                enablePanDownToClose
                onClose={handleClose}
                backgroundStyle={{
                    backgroundColor: theme.colors.card,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                }}
            >
                <BottomSheetView style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        {/* Title */}
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "700",
                                color: theme.colors.text,
                                marginBottom: 12,
                            }}
                        >
                            {title}
                        </Text>

                        {/* Content */}
                        {content}

                        {/* Actions */}
                        {actions.length > 0 && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 20,
                                }}
                            >
                                {actions.map((action, idx) => {
                                    let backgroundColor = theme.colors.border;
                                    if (action.type === "primary")
                                        backgroundColor = theme.colors.primary;
                                    if (action.type === "danger")
                                        backgroundColor = "#e74c3c";

                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            onPress={action.onPress}
                                            disabled={action.disabled}
                                            style={{
                                                backgroundColor,
                                                flex: 1,
                                                marginHorizontal: 4,
                                                padding: 12,
                                                borderRadius: 8,
                                                alignItems: "center",
                                                opacity: action.disabled ? 0.6 : 1,
                                            }}
                                        >
                                            <Text style={{ color: "#fff", fontWeight: "600" }}>
                                                {action.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}

                        {/* Close */}
                        <TouchableOpacity
                            onPress={() => sheetRef.current?.close()}
                            style={{ marginTop: 16, alignSelf: "center" }}
                        >
                            <Text
                                style={{ color: theme.colors.primary, fontWeight: "600" }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

export default ReusableBottomSheet;
