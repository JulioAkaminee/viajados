import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import Input from "../components/Input";

export default function Cadastro() {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dtNasc, setDtNasc] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [sexo, setSexo] = useState("Masculino");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");

  const validaEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const formatarCpf = (text: string) => {
    let cpfFormatado = text.replace(/\D/g, "");
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, "$1.$2");
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, "$1.$2");
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    if (cpfFormatado.length <= 14) {
      setCpf(cpfFormatado);
    }
  };

  const formatarDataInput = (text: string) => {
    let data = text.replace(/\D/g, "");
    if (data.length > 2) {
      data = data.replace(/(\d{2})(\d)/, "$1-$2");
    }
    if (data.length > 5) {
      data = data.replace(/(\d{2})-(\d{2})(\d)/, "$1-$2-$3");
    }
    if (data.length <= 10) {
      setDtNasc(data);
    }
  };

  const converterDataParaEnvio = (data: string) => {
    const partes = data.split("-");
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return data;
  };

  const continuarPressionado = async () => {
    const nomeFormatado = nome.trim().replace(/\s+/g, ""); // Remove espaços extras
    const nacionalidadeFormatado = nacionalidade.trim().replace(/\s+/g, "");
    const cpfNumerico = cpf.replace(/\D/g, "");
    const sexoFormatado = sexo === "Masculino" ? "M" : "F";
    const dataFormatada = converterDataParaEnvio(dtNasc);

    if (!nomeFormatado) {
      Alert.alert("Erro", "O campo Nome não pode estar vazio.");
      return;
    }

    if (cpfNumerico.length !== 11) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }

    if (!dataFormatada) {
      Alert.alert("Erro", "O campo Data de Nascimento não pode estar vazio.");
      return;
    }

    if (!nacionalidadeFormatado) {
      Alert.alert("Erro", "O campo Nacionalidade não pode estar vazio.");
      return;
    }

    if (!email.trim() || !validaEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    if (!senha.trim() || !confSenha.trim()) {
      Alert.alert("Erro", "Os campos de senha não podem estar vazios.");
      return;
    }

    if (senha !== confSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const dadosUsuario = {
      email: email,
      senha: senha,
      nome: nomeFormatado,
      ativo: 1,
      cpf: cpfNumerico,
      data_nascimento: dataFormatada, // Ajustado para o nome esperado pela API
      nacionalidade: nacionalidadeFormatado,
      sexo: sexoFormatado,
    };

    try {
      const resposta = await fetch(
        "https://backend-viajados.vercel.app/api/cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // Boa prática adicionar
          },
          body: JSON.stringify(dadosUsuario),
        }
      );

      const dados = await resposta.json();

      if (resposta.status === 201) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate("index") },
        ]);
      } else {
        Alert.alert(
          "Erro",
          dados.message || "Falha ao cadastrar. Tente novamente."
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao se conectar com o servidor.");
      console.error("Erro na requisição:", error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>

      <Input
        label="Digite seu nome:"
        placeholder="Digite seu nome"
        value={nome}
        onChange={setNome}
      />

      <Input
        label="CPF:"
        placeholder="000.000.000-00"
        value={cpf}
        onChange={formatarCpf}
      />

      <Input
        label="Data de Nascimento:"
        placeholder="DD-MM-AAAA"
        value={dtNasc}
        onChange={formatarDataInput}
      />

      <Input
        label="Nacionalidade:"
        placeholder="Brasileiro"
        value={nacionalidade}
        onChange={setNacionalidade}
      />

      <Text style={styles.legenda}>Sexo:</Text>
      <View style={styles.opcoesSexo}>
        <Button
          label="Masculino"
          onPress={() => setSexo("Masculino")}
          style={sexo === "Masculino" ? styles.selecionado : {}}
        />
        <Button
          label="Feminino"
          onPress={() => setSexo("Feminino")}
          style={sexo === "Feminino" ? styles.selecionado : {}}
        />
      </View>

      <Input
        label="Digite seu Email:"
        placeholder="email@example.com"
        value={email}
        onChange={setEmail}
      />

      <Input
        label="Digite sua Senha:"
        placeholder="*******"
        secureTextEntry
        value={senha}
        onChange={setSenha}
      />

      <Input
        label="Confirme sua Senha:"
        placeholder="*******"
        secureTextEntry
        value={confSenha}
        onChange={setConfSenha}
      />

      <Button label={"Continuar"} onPress={continuarPressionado} />

      <Text style={styles.textoTermos}>
        Ao criar uma conta, você concorda com a nossa{" "}
        <Text style={styles.link}>Política de privacidade</Text> e os nossos{" "}
        <Text style={styles.link}>Termos de uso</Text>.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDD5E9",
    padding: 20,
  },
  containerLogo: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 130,
    height: 90,
    marginTop: 20,
    marginBottom: 10,
  },
  containerTexto: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  legenda: {
    color: "#D6005D",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  opcoesSexo: {
    flexDirection: "row",
    gap: 30,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
  },
  selecionado: {
    backgroundColor: "#D6005D",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textoTermos: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  link: {
    color: "#FF3366",
    textDecorationLine: "underline",
  },
});
