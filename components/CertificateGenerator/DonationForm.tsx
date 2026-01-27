import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

interface DonationData {
  donorName: string;
  amount: string;
  date: string;
}

interface DonationFormProps {
  onSubmit: (data: DonationData) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onSubmit }) => {
  const [donorName, setDonorName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleSubmit = () => {
    if (!donorName || !amount || !date) return;
    onSubmit({ donorName, amount, date });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Donor Name"
        value={donorName}
        onChangeText={setDonorName}
      />
      <TextInput
        style={styles.input}
        placeholder="Donation Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Date (DD/MM/YYYY)"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Generate Certificate" onPress={handleSubmit} />
    </View>
  );
};

export default DonationForm;

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});
