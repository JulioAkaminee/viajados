import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

import {
  ActivityIndicator,
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

// Funções de formatação
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
      setUsuario((prev) => ({
        ...prev,
        foto_usuario: manipResult.base64,
      }));
    }
  };

  const handleSalvar = async () => {
    if (!novoNome.trim() && !novaFoto) {
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
      }));
      setNovaFoto(null);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      setModalVisivel(false);
    } catch (error) {
      console.error("Erro no handleSalvar:", error);
      Alert.alert("Erro", error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d6005d" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: usuario.foto_usuario.startsWith("data:")
                ? usuario.foto_usuario
                : `data:image/jpeg;base64,${usuario.foto_usuario}`,
            }}
            style={styles.profileImage}
          />
          <Pressable onPress={selecionarFoto} style={styles.changePhotoButton}>
            <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{usuario.nome}</Text>
          <Pressable onPress={() => setModalVisivel(true)} style={styles.editButton}>
            <MaterialIcons name="edit" size={20} color="#d6005d" />
          </Pressable>
        </View>
        <Pressable 
          onPress={handleLogout} 
          style={styles.logoutButton}
        >
          <MaterialIcons name="logout" size={20} color="#d6005d" />
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem label="CPF" value={usuario.cpf} />
        <InfoItem label="Data de Nascimento" value={usuario.data_nascimento} />
        <InfoItem label="Nacionalidade" value={usuario.nacionalidade} />
        <InfoItem label="Sexo" value={usuario.sexo} />
      </View>

      <View style={styles.actionsContainer}>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Excluir Conta</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            
            <TextInput
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Novo nome"
              style={styles.input}
              placeholderTextColor="#888888"
            />

            <View style={styles.modalActions}>
              <Pressable 
                onPress={handleSalvar} 
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
              <Pressable 
                onPress={() => setModalVisivel(false)} 
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDD5E9",
    padding: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
      borderWidth: 1,
    borderColor: "#d6005d",
    position: "relative",
    borderRadius:10
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
    
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "white",
  },
  changePhotoButton: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "#d6005d",
    padding: 8,
    borderRadius: 20,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userName: {
    fontSize: 26,
    fontWeight: "500",
    color: "black",
    letterSpacing: 0.5,
  },
  editButton: {
    padding: 8,
  },
  logoutButton: {
    position: "absolute",
    right: 20,
    top: 20,
    padding: 8,
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: "#d6005d",
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  infoLabel: {
    fontSize: 16,
    color: "black",
    fontWeight: "400",
  },
  infoValue: {
    fontSize: 16,
    color: "black",
    fontWeight: "400",
  },
  actionsContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#d6005d",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#d6005d",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    width: "85%",
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d6005d",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#3A3A3A",
    marginBottom: 20,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#d6005d",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#d6005d",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d6005d",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDD5E9",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#888888",
    letterSpacing: 0.5,
  },
});