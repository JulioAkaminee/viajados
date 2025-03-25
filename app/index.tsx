import React, { useState } from "react";
import { View, Text, StyleSheet, Image, StatusBar, Alert } from "react-native";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import Input from "../components/Input";

export default function Index() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const validaEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  function navegarParaHome(){
    navigation.navigate("(tabs)", { screen: "explorar" })
  }

  const continuarPressionado = async () => {
    if (!email.trim() || !validaEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    if (!senha.trim()) {
      Alert.alert("Erro", "O campo de senha não pode estar vazio.");
      return;
    }

    const dadosUsuario = { email, senha };

    try {
      const resposta = await fetch("https://backend-viajados.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dadosUsuario),
      });

      const dados = await resposta.json();

      if (resposta.status === 200) {
        Alert.alert("Sucesso", "Login realizado com sucesso!", [
          {
            text: "OK",
            onPress: () => navegarParaHome(),
          },
        ]);
      } else if (resposta.status === 404 || resposta.status === 401) {
        Alert.alert("Erro", "Email e/ou senha incorretos!");
      } else {
        Alert.alert(
          "Erro",
          dados.message || "Falha ao realizar login. Tente novamente."
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na conexão com o servidor. Tente novamente.");
      console.error("Erro na requisição:", error);
    }
  };

  return (
    // ... resto do código JSX permanece igual
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FDD5E9"
        translucent={false}
      />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        <Input
          label="Digite seu Email:"
          placeholder="email@example.com"
          onChange={setEmail}
          value={email}
        />

        <Input
          label="Digite sua Senha:"
          placeholder="*******"
          secureTextEntry
          value={senha}
          onChange={setSenha}
        />

        <View style={styles.ContainerRecPass}>
          <Link href="/recuperarSenha" style={styles.link}>
            Esqueceu a senha?
          </Link>
        </View>

        <Button label={"Continuar"} onPress={continuarPressionado} />

        <Text style={styles.textContainer}>
          Não tem uma conta?{" "}
          <Link href="/cadastro" style={styles.link}>
            Cadastre-se aqui
          </Link>
        </Text>

        <Text style={styles.termsText}>
          Ao criar uma conta, você concorda com a nossa{" "}
          <Text style={styles.link}>Política de privacidade</Text> e os nossos{" "}
          <Text style={styles.link}>Termos de uso</Text>.
        </Text>
      </View>
    </>
  );
}

// ... styles permanecem iguais

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
});
