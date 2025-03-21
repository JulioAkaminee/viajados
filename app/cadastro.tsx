import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import Button from "../components/Button";
import Input from "../components/Input";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ConfPassword, setConfPassword] = useState("");

  // Função handleContinue para o botão
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

      {/* Campo Nome */}
      <Input
        label="Digite seu nome:"
        placeholder="Digite seu nome"
        value={name}
        onChange={setName}
      />

      {/* Campo de Email */}
      <Input
        label="Digite seu Email:"
        placeholder="email@example.com"
        value={email}
        onChange={setEmail}
      />

      {/* Campo de Senha */}
      <Input
        label="Digite sua Senha:"
        placeholder="*******"
        secureTextEntry
        value={password}
        onChange={setPassword}
      />

      {/* Campo de conf Senha */}
      <Input
        label="Confirme sua Senha:"
        placeholder="*******"
        secureTextEntry
        value={ConfPassword}
        onChange={setConfPassword}
      />

      {/* Botão Continuar */}
      <Button label={"Continuar"} onPress={handleContinue} />

      {/* Texto de Política de Privacidade */}
      <Text style={styles.termsText}>
        Ao criar uma conta, você concorda com a nossa{" "}
        <Text style={styles.link}>Política de privacidade</Text> e os nossos{" "}
        <Text style={styles.link}>Termos de uso</Text>.
      </Text>
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
});
