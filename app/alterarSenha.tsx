import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [ConfPassword, setConfPassword] = useState("");

  // Funcao handleContinue para o botao
  const handleContinue = () => {
    console.log("Botão Continuar pressionado");
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* Titulo e descricao */}
        <Text style={styles.title}>Recuperar senha</Text>

      {/* Campo de Senha */}
      <Input
        label="Nova Senha:"
        placeholder="*******"
        secureTextEntry
        value={password}
        onChange={setPassword}
      />

      {/* Campo de conf Senha */}
      <Input
        label="Confirme sua Nova Senha:"
        placeholder="*******"
        secureTextEntry
        value={ConfPassword}
        onChange={setConfPassword}
      />

      {/* Botão Continuar */}
      <Button label={"Continuar"} onPress={handleContinue} />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDD5E9",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 130,
    height: 90,
    marginBottom: 10,
  },
  textlabel: {
    fontSize: 16,
    color: "#333",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  textContainer: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "#FF3366",
    textDecorationLine: "underline",
  },
  ContainerRecPass: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D6005D",
    marginBottom: 30,
  }
});

export default UpdatePassword;
