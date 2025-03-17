// styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  
  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",

  },

  // Estilo base do texto
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },

  // Variant: Primário
  primary: {
    width: 76,
    height: 20,
    backgroundColor: "#D6005D",
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  labelPrimary: {
    color: "#FFFFFF",
  },

  // Variant: Secundário
  secondary: {
    width: 76,
    height: 20,
    backgroundColor: "#D6005D",
    padding: 20,
  },
  labelSecondary: {
    color: "#FFFFFF",
  },

  // Variant: Terceiro
  terceiro: {
    width: 76,
    height: 20,
    backgroundColor: "#D6005D",
    padding: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  labelTerceiro: {
    color: "#FFFFFF",
  },
  
});

export default styles;