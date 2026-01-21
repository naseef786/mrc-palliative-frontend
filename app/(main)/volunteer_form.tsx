import api from "@/api/axios";
import { updateVolunteerApi } from "@/api/volunteer.api";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";


export default function VolunteerForm() {
    const route: any = useRoute();
    const navigation = useNavigation();
    const volunteer = route.params?.volunteer;

    const [name, setName] = useState(volunteer?.name || "");
    const [email, setEmail] = useState(volunteer?.email || "");
    const [phone, setPhone] = useState(volunteer?.phone || "");

    const submit = async () => {
        try {
            if (volunteer) {
                await updateVolunteerApi(volunteer._id, {
                    name,
                    email,
                    phone,
                });
            } else {
                await api.post("/auth/signup", {
                    name,
                    email,
                    phone,
                    password: "123456",
                    role: "volunteer",
                });
            }

            navigation.goBack();
        } catch (e) {
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} />
            <Button title="Save Volunteer" onPress={submit} />
        </View>
    );
}
