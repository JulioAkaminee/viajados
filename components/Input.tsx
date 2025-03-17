import { Text, StyleSheet, TextInput, View } from "react-native";

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  secureTextEntry?: boolean;
  onChange?: (text: string) => void;
};

function Input({ label, placeholder, onChange, value, secureTextEntry }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#999"
        onChangeText={onChange} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#D6005D",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default Input;