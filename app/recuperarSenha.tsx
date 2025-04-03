import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import Input from "../components/Input";

export default function RecuperarSenha() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const validaEmail = (email: string) => {
    const resp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return resp.test(email);
  };

  const enviarPressionado = async () => {
    if (!email.trim() || !validaEmail(email)) {
      Alert.alert("Erro:", "Por favor, insira um email válido.");
      return;
    }

    const emailUsuario = { email };

    try {
      const resposta = await fetch(
        "https://backend-viajados.vercel.app/api/alterarsenha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailUsuario),
        }
      );

      const dados = await resposta.json();

      if (resposta.status === 200) {
        Alert.alert("Sucesso:", "Email enviado com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate("index") },
        ]);
      } else {
        Alert.alert(
          "Erro:",
          dados.message || "Falha ao enviar email. Tente novamente."
        );
      }
    } catch (error) {
      Alert.alert("Erro:", "Ocorreu um erro ao se conectar com o servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.titulo}>Recuperar senha</Text>
      <Text style={styles.descricao}>
        Coloque seu endereço de e-mail para receber o link de alteração de
        senha.
      </Text>

      <Input
        label="Digite Seu endereço de Email:"
        placeholder="email@example.com"
        value={email}
        onChange={setEmail}
      />

      <Button label={"Enviar"} onPress={enviarPressionado} />
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
  containerLogo: {
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 130,
    height: 90,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D6005D",
    marginBottom: 20,
  },
  descricao: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  link: {
    color: "#FF3366",
    textDecorationLine: "underline",
  },
});
