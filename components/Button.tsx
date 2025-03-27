import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import React from "react";

type Props = TouchableOpacityProps & {
  label: String;
  corDoTexto?: string; // Nova prop para mudar a cor do texto
};

function Button({ label, corDoTexto = "#FFF", ...rest }: Props) { 
  return (
    <TouchableOpacity style={styles.button} {...rest}>
      <Text style={[styles.label, { color: corDoTexto}]}>{label}</Text> 
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#D6005D",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
