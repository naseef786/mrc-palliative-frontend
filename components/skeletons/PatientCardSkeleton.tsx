import { StyleSheet, View } from "react-native";

export function PatientSkeleton() {
    return (
        <View style={styles.card}>
            <View style={styles.lineLarge} />
            <View style={styles.line} />
            <View style={styles.lineSmall} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#EAEAEA",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },
    lineLarge: {
        height: 18,
        width: "60%",
        backgroundColor: "#D3D3D3",
        borderRadius: 8,
        marginBottom: 10,
    },
    line: {
        height: 14,
        width: "80%",
        backgroundColor: "#D3D3D3",
        borderRadius: 8,
        marginBottom: 8,
    },
    lineSmall: {
        height: 14,
        width: "40%",
        backgroundColor: "#D3D3D3",
        borderRadius: 8,
    },
});
