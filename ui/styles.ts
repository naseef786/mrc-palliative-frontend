import { StyleSheet } from "react-native";

export const UI = StyleSheet.create({
    screen: { flex: 1 },
    padding: { padding: 16 },

    input: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        fontSize: 15,
        marginBottom: 12,
    },

    card: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },

    title: { fontSize: 18, fontWeight: "700" },
    label: { fontSize: 13, opacity: 0.6 },
    value: { fontSize: 15, fontWeight: "500" },

    primaryBtn: {
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },

    dangerBtn: {
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "#F44336",
    },

    btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },
    container: { flex: 1, padding: 16 },
    center: { flex: 1, justifyContent: "center" },
    header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
    search: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    addBtn: {
        backgroundColor: "#2196F3",
        padding: 14,
        borderRadius: 14,
        marginBottom: 12,
        alignItems: "center",
    },
    addText: { color: "#fff", fontWeight: "600" },

    name: { fontSize: 16, fontWeight: "700" },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    edit: { color: "#2196F3" },
    delete: { color: "#F44336" },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 16,
    },
    error: { color: "#F44336", fontSize: 12 },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    cancel: { color: "#999", fontSize: 16 },
    save: { color: "#2196F3", fontSize: 16, fontWeight: "600" },

});
