import React, { forwardRef } from "react";
import { Dimensions, Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

interface CertificateProps {
    donorName: string;
    amount: string;
    date: string;
    logo: ImageSourcePropType;
    signature: ImageSourcePropType;
}

const Certificate = forwardRef<View, CertificateProps>(
    ({ donorName, amount, date, logo, signature }, ref) => {
        return (
            <View style={styles.container} ref={ref}>
                <View style={styles.header}>
                    <Image source={logo} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.title}>Palliative Care</Text>
                </View>

                <Text style={styles.message}>Certificate of Appreciation</Text>

                <View style={styles.body}>
                    <Text style={styles.text}>This certificate is proudly presented to</Text>
                    <Text style={styles.name}>{donorName}</Text>
                    <Text style={styles.text}>for a generous donation of</Text>
                    <Text style={styles.amount}>${amount}</Text>
                    <Text style={styles.text}>on {date}</Text>
                </View>

                <View style={styles.footer}>
                    <Image source={signature} style={styles.signature} resizeMode="contain" />
                    <Text style={styles.signatureText}>Manager</Text>
                </View>
            </View>
        );
    }
);

export default Certificate;

const styles = StyleSheet.create({
    container: {
        width: width - 40,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 15,
        elevation: 5,
        alignSelf: "center",
        marginVertical: 20,
    },
    header: { alignItems: "center", marginBottom: 20 },
    logo: { width: 100, height: 60 },
    title: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
    message: { fontSize: 20, textAlign: "center", marginVertical: 10, fontWeight: "600" },
    body: { alignItems: "center", marginVertical: 20 },
    text: { fontSize: 16 },
    name: { fontSize: 22, fontWeight: "bold", marginVertical: 5 },
    amount: { fontSize: 20, fontWeight: "600", color: "#007AFF" },
    footer: { alignItems: "center", marginTop: 20 },
    signature: { width: 120, height: 50 },
    signatureText: { fontSize: 14, marginTop: 5 },
});
