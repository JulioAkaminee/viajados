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
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import deletar from "../../functions/deletar";
import deslogar from "../../functions/deslogar";
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
  return sexo.toUpperCase() === "M"
    ? "Masculino"
    : sexo.toUpperCase() === "F"
    ? "Feminino"
    : "Não informado";
};

export default function MinhaConta() {
  const navigation = useNavigation();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [token, setToken] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [novaFoto, setNovaFoto] = useState(null);
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

        if (response.ok && data.length > 0) {
          setUsuario({
            nome: data[0].nome || "Não informado",
            cpf: formatarCPF(data[0].cpf),
            data_nascimento: formatarData(data[0].data_nascimento),
            nacionalidade: data[0].nacionalidade || "Não informado",
            sexo: formatarSexo(data[0].sexo),
            foto_usuario:
              data[0].foto_usuario || "https://via.placeholder.com/150",
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

  const selecionarFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;

      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      const base64Size = (manipResult.base64.length * 3) / 4 / 1024 / 1024;

      if (base64Size > 5) {
        Alert.alert(
          "Erro",
          "A imagem é muito grande, mesmo após compressão. Tente uma imagem menor."
        );
        return;
      }

      setNovaFoto(manipResult.base64);
    }
  };

  const handleSalvar = async () => {
    if ((!novoNome.trim() || novoNome === usuario.nome) && !novaFoto) {
      Alert.alert("Erro", "Nenhum dado foi alterado.");
      return;
    }

    try {
      if (novoNome.trim() && novoNome !== usuario.nome) {
        const responseNome = await fetch(
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

        const dataNome = await responseNome.json();
        if (!responseNome.ok) {
          throw new Error(dataNome.mensagem || "Erro ao atualizar o nome.");
        }
      }

      if (novaFoto && novaFoto !== usuario.foto_usuario) {
        const payload = JSON.stringify({
          idUsuario: usuarioId,
          foto_usuario: novaFoto,
        });
        const payloadSize = (payload.length * 3) / 4 / 1024 / 1024;

        if (payloadSize > 5) {
          throw new Error("O tamanho da requisição excede o limite de 5 MB.");
        }

        const responseFoto = await fetch(
          "https://backend-viajados.vercel.app/api/salvar-imagem",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: payload,
          }
        );

        const responseText = await responseFoto.text();

        let dataFoto;
        try {
          dataFoto = JSON.parse(responseText);
        } catch (parseError) {
          if (
            responseText.trim() === "Foto do usuário cadastrada com sucesso!"
          ) {
            dataFoto = { mensagem: responseText };
          } else {
            throw new Error("Resposta inesperada do servidor: " + responseText);
          }
        }

        if (!responseFoto.ok) {
          throw new Error(dataFoto.mensagem || "Erro ao atualizar a foto.");
        }
      }

      setUsuario((prev) => ({
        ...prev,
        nome: novoNome.trim() && novoNome !== prev.nome ? novoNome : prev.nome,
        foto_usuario: novaFoto || prev.foto_usuario,
      }));
      setNovaFoto(null);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      setModalVisivel(false);
    } catch (error) {
      console.error("Erro no handleSalvar:", error);
      Alert.alert("Erro", error.message);
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
            source={{
              uri: usuario.foto_usuario.startsWith("data:")
                ? usuario.foto_usuario
                : `data:image/jpeg;base64,${usuario.foto_usuario}`,
            }}
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
              <Pressable
                onPress={selecionarFoto}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: 20,
                  position: "relative",
                }}
              >
                <Image
                  source={{
                    uri: novaFoto
                      ? `data:image/jpeg;base64,${novaFoto}`
                      : usuario.foto_usuario.startsWith("data:")
                      ? usuario.foto_usuario
                      : `data:image/jpeg;base64,${usuario.foto_usuario}`,
                  }}
                  style={styles.imagemModal}
                />
                <Text style={styles.textoAlterar}>Toque para Alterar</Text>
              </Pressable>
              <Pressable
                style={styles.botaoFechar}
                onPress={() => setModalVisivel(false)}
              >
                <MaterialIcons name={"close"} size={35} color="#D6005D" />
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
    fontSize: 16,
    marginTop: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#D6005D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
  },
  textoAviso: {
    width: "80%",
    fontSize: 14,
    color: "#000",
    fontWeight: "300",
    marginBottom: 5,
    textAlign: "center",
  },
  botaoEliminar: {
    backgroundColor: "#E83153",
  },
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  conteudoModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  secaoModal: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagemModal: {
    width: "100%",
    height: 250,
    borderRadius: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  botaoFechar: {
    fontSize: 35,
    position: "absolute",
    right: 10,
    top: 10,
  },
  textoAlterar: {
    position: "absolute",
    color: "#D6005D",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
