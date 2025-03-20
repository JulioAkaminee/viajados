import { View, Text, StyleSheet, Image, } from "react-native";
import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "expo-router";

function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      {/* Campo de Email */}
      
      <Input 
        label="Digite seu Email:" 
        placeholder="email@example.com" 
        onChange={setEmail}
        value={email}
      />

      {/* Campo de Senha */}
      <Input 
        label="Digite sua Senha:" 
        placeholder="*******" 
        secureTextEntry
        value={password}
        onChange={setPassword}
        
      
      />

      {/* Link "Esqueceu a senha?" */}
      <View style={styles.ContainerRecPass}>
        <Link href="/recuperarSenha" style={styles.link}>
          Esqueceu a senha?
        </Link>
      </View>

      {/* Botão Continuar */}
      <Link href={"/(tabs)/explorar"}>
        <Button
         label={"Continuar"}
         onPress={handleContinue} />
      </Link>

      {/* Texto "Cadastre-se aqui" com Link */}
      <Text style={styles.textContainer}>
        Não tem uma conta?{" "}
        <Link href="/cadastro" style={styles.link}>
          Cadastre-se aqui
        </Link>
      </Text>

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

export default Index;
