import Certificate from "@/components/certificate-generation/Certificate";
import DonationForm from "@/components/certificate-generation/DonationForm";
import * as FileSystem from "expo-file-system/legacy"; // legacy API
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeOut, Layout, ZoomIn } from "react-native-reanimated";
import { captureRef } from "react-native-view-shot";

interface DonationData {
    donorName: string;
    amount: string;
    date: string;
}

const CertificationGeneration: React.FC = () => {
    const certificateRef = useRef<View | null>(null);
    const [donationData, setDonationData] = useState<DonationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [readyToCapture, setReadyToCapture] = useState(false);

    // Validate if form fields are filled
    const isFormValid = (data: DonationData | null) =>
        data?.donorName.trim() !== "" && data?.amount.trim() !== "" && data?.date.trim() !== "";

    const handleGenerate = async () => {
        if (!donationData || !readyToCapture || !certificateRef.current) {
            Alert.alert("Please wait", "Certificate is rendering...");
            return;
        }

        setLoading(true);
        try {
            // Capture certificate as image
            const uri = await captureRef(certificateRef, { format: "png", quality: 1 });

            // Save to app's document directory
            const fileUri = FileSystem.documentDirectory + `certificate_${Date.now()}.png`;
            await FileSystem.copyAsync({ from: uri, to: fileUri });

            // Share the image
            await Sharing.shareAsync(fileUri);
        } catch (error: any) {
            console.log(error);
            Alert.alert("Error", "Failed to generate certificate: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
            {/* Donation Form */}
            <DonationForm
                onSubmit={(data) => setDonationData(data)}
            />

            {/* Generate button */}
            <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                <Button
                    title="Generate & Share Certificate"
                    onPress={handleGenerate}
                    disabled={!isFormValid(donationData) || loading}
                />
            </View>

            {/* Loader */}
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            )}

            {/* Offscreen certificate for capture */}
            {donationData && (
                <Animated.View
                    ref={certificateRef}
                    onLayout={() => setReadyToCapture(true)}
                    style={{ position: "absolute", left: -1000, top: -1000 }}
                >
                    <Certificate
                        donorName={donationData.donorName}
                        amount={donationData.amount}
                        date={donationData.date}
                        logo={require("../../assets/images/react-logo.png")}
                        signature={require("../../assets/images/react-logo.png")}
                    />
                </Animated.View>
            )}

            {/* Onscreen animated certificate preview */}
            {donationData && !loading && (
                <Animated.View
                    layout={Layout.springify()}
                    entering={ZoomIn.delay(100)}
                    exiting={FadeOut}
                >
                    <Certificate
                        donorName={donationData.donorName}
                        amount={donationData.amount}
                        date={donationData.date}
                        logo={require("../../assets/images/react-logo.png")}
                        signature={require("../../assets/images/react-logo.png")}
                    />
                </Animated.View>
            )}
        </ScrollView>
    );
};

export default CertificationGeneration;

const styles = StyleSheet.create({
    loader: {
        marginVertical: 20,
        alignItems: "center",
    },
});
