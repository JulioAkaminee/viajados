import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import deletar from "../../functions/deletar";
import deslogar from "../../functions/deslogar";
import { useNavigation } from "@react-navigation/native";
import verificarToken from "../verificarToken";

const formatarData = (dataISO) => {
  if (!dataISO) return "Não informado";
  const data = new Date(dataISO);
  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  const ano = data.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
};

const formatarCPF = (cpf) => {
  if (!cpf || cpf.length !== 11) return "Não informado";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatarSexo = (sexo) => {
  if (!sexo) return "Não informado";
  return sexo.toUpperCase() === "M" ? "Masculino" : sexo.toUpperCase() === "F" ? "Feminino" : "Não informado";
};

export default function MinhaConta() {
  const navigation = useNavigation();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [token, setToken] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => {} },
      { text: "Sim", onPress: () => deslogar(navigation) },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir minha conta",
      "Tem certeza que deseja excluir sua conta?",
      [
        { text: "Cancelar", onPress: () => {} },
        { text: "Sim", onPress: () => deletar(usuarioId, token, navigation) },
      ]
    );
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        setIsLoading(true);
        const tokenArmazenado = await AsyncStorage.getItem("token");
        const idArmazenado = await AsyncStorage.getItem("idUsuario");

        if (!tokenArmazenado || !idArmazenado) {
          Alert.alert("Erro", "Credenciais não encontradas");
          return;
        }

        setToken(tokenArmazenado);
        setUsuarioId(idArmazenado);

        const response = await fetch(
          `https://backend-viajados.vercel.app/api/alterardados/dadosusuario?idUsuario=${idArmazenado}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenArmazenado}`,
            },
          }
        );

        const data = await response.json();
        console.log("Dados da Api:", data);

        if (response.ok && data.length > 0) {
          setUsuario({
            nome: data[0].nome || "Não informado",
            cpf: formatarCPF(data[0].cpf),
            data_nascimento: formatarData(data[0].data_nascimento),
            nacionalidade: data[0].nacionalidade || "Não informado",
            sexo: formatarSexo(data[0].sexo),
            foto_usuario: data[0].foto_usuario ,
          });
        } else {
          Alert.alert("Erro", "Não foi possível carregar os dados de usuário.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Erro ao buscar os dados do usuário.");
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
    verificarToken(navigation);
  }, [navigation]);

  const handleSalvar = async () => {
    if (!novoNome.trim()) {
      Alert.alert("Erro", "O nome não pode estar vazio.");
      return;
    }

    try {
      const response = await fetch(
        `https://backend-viajados.vercel.app/api/alterardados?idUsuario=${usuarioId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nome: novoNome }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Nome atualizado com sucesso!");
        setUsuario((prev) => ({ ...prev, nome: novoNome }));
        setModalVisivel(false);
      } else {
        Alert.alert("Erro", data.mensagem || "Não foi possível atualizar o nome.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar o nome.");
    }
  };

  if (isLoading || !usuario) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInformacoes}>
        <View style={styles.fotoNome}>
          <Image
            source={{ uri: usuario.foto_usuario }}
            style={styles.imagemPerfil}
          />
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Pressable onPress={() => setModalVisivel(true)}>
            <MaterialIcons name={"edit"} size={35} color="#D6005D" />
          </Pressable>
        </View>

        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>CPF:</Text> {usuario.cpf}
        </Text>
        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>Data de nascimento:</Text>{" "}
          {usuario.data_nascimento}
        </Text>
        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>Nacionalidade:</Text>{" "}
          {usuario.nacionalidade}
        </Text>
        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>Sexo:</Text> {usuario.sexo}
        </Text>
      </View>

      <Text style={styles.legenda}>Sair da conta</Text>
      <Pressable style={styles.botao} onPress={handleLogout}>
        <Text style={styles.textoBotao}>Sair</Text>
      </Pressable>

      <Text style={styles.legenda}>Excluir minha conta</Text>
      <Text style={styles.textoAviso}>
        Se você excluir a sua conta, não será possível recuperá-la depois.
      </Text>
      <Pressable
        style={[styles.botao, styles.botaoEliminar]}
        onPress={handleDelete}
      >
        <Text style={styles.textoBotao}>Excluir</Text>
      </Pressable>

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.containerModal}>
          <View style={styles.conteudoModal}>
            <View style={styles.secaoModal}>
              <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: 20 }}>
                <Image
                  source={{ uri: usuario.foto_usuario }}
                  style={styles.imagemPerfil}
                />
              </View>
              <Pressable onPress={() => setModalVisivel(false)}>
                <Text style={styles.botaoFechar}>
                  <MaterialIcons name={"close"} size={35} color="#D6005D" />
                </Text>
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              placeholder={usuario.nome || "Nome"}
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <Pressable style={styles.botao} onPress={handleSalvar}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDD5E9",
    alignItems: "center",
    paddingTop: 50,
  },
  containerInformacoes: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  fotoNome: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 20,
  },
  imagemPerfil: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 10,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    textAlign: "center",
    marginTop: 35,
    marginLeft: 75,
  },
  informacoes: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    textAlign: "left",
    width: "100%",
  },
  legenda: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D6005D",
    marginTop: 20,
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#D6005D",
    padding: 12,
    borderRadius: 20,
    width: "40%",
    alignItems: "center",
    marginTop: 10,
  },
  botaoEliminar: {
    backgroundColor: "#D6005D",
  },
  textoBotao: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  textoAviso: {
    color: "#000",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    width: "80%",
  },
  containerModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  conteudoModal: {
    backgroundColor: "#FFCCE0",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
  },
  secaoModal: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoFechar: {
    fontSize: 24,
    color: "#FF007F",
    position: "absolute",
    top: 8,
    right: 4,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});