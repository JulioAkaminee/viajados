import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
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
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim", style: "destructive", onPress: () => deslogar(navigation) },
    ]);
  };

  const handleDelete = () => {
    setConfirmDeleteModal(true);
  };

  const confirmDelete = () => {
    setConfirmDeleteModal(false);
    deletar(usuarioId, token, navigation);
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
          setNovoNome(data[0].nome || "");
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
      aspect: [1, 1],
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
      Alert.alert("Aviso", "Nenhum dado foi alterado.");
      setModalVisivel(false);
      return;
    }

    try {
      setIsLoading(true);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <ActivityIndicator size="large" color="#D6005D" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  if (!usuario) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <Ionicons name="alert-circle-outline" size={60} color="#D6005D" />
        <Text style={styles.errorText}>Não foi possível carregar os dados</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace("MinhaConta")}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={28} color="#D6005D" />
          </TouchableOpacity>
        </View>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#D6005D', '#FF3B8B']}
            style={styles.profileHeader}
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: usuario.foto_usuario.startsWith("data:")
                    ? usuario.foto_usuario
                    : `data:image/jpeg;base64,${usuario.foto_usuario}`,
                }}
                style={styles.profileImage}
              />
              <View style={styles.editProfileButton}>
                <TouchableOpacity onPress={() => setModalVisivel(true)}>
                  <MaterialIcons name="edit" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.profileName}>{usuario.nome}</Text>
          </LinearGradient>
          
          {/* Info Section */}
          <View style={styles.infoSection}>
            <InfoItem icon="fingerprint" label="CPF" value={usuario.cpf} />
            <InfoItem icon="cake" label="Data de Nascimento" value={usuario.data_nascimento} />
            <InfoItem icon="public" label="Nacionalidade" value={usuario.nacionalidade} />
            <InfoItem icon="person" label="Sexo" value={usuario.sexo} lastItem />
          </View>
        </View>
        
        {/* Account Actions */}
        <View style={styles.accountActions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete-outline" size={22} color="#D6005D" />
            <Text style={styles.deleteButtonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>
        
        {/* Edit Profile Modal */}
        <Modal
          visible={modalVisivel}
          animationType="slide"
          transparent={true}
          statusBarTranslucent={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Editar Perfil</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisivel(false)}
                  >
                    <MaterialIcons name="close" size={28} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  style={styles.photoSelector}
                  onPress={selecionarFoto}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri: novaFoto
                        ? `data:image/jpeg;base64,${novaFoto}`
                        : usuario.foto_usuario.startsWith("data:")
                        ? usuario.foto_usuario
                        : `data:image/jpeg;base64,${usuario.foto_usuario}`,
                    }}
                    style={styles.modalPhoto}
                  />
                  <View style={styles.photoOverlay}>
                    <MaterialIcons name="camera-alt" size={28} color="white" />
                    <Text style={styles.photoText}>Alterar foto</Text>
                  </View>
                </TouchableOpacity>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Seu nome"
                    value={novoNome}
                    onChangeText={setNovoNome}
                    placeholderTextColor="#999"
                  />
                </View>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSalvar}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>Salvar alterações</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        
        {/* Confirm Delete Modal */}
        <Modal
          visible={confirmDeleteModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.confirmModalOverlay}>
            <View style={styles.confirmModalContent}>
              <Ionicons name="warning" size={60} color="#D6005D" />
              <Text style={styles.confirmModalTitle}>Excluir conta</Text>
              <Text style={styles.confirmModalText}>
                Esta ação não pode ser desfeita. Todos os seus dados serão removidos permanentemente.
              </Text>
              <View style={styles.confirmModalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setConfirmDeleteModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmButtonText}>Sim, excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const InfoItem = ({ icon, label, value, lastItem = false }) => {
  return (
    <View style={[styles.infoItem, !lastItem && styles.infoItemBorder]}>
      <View style={styles.infoLabel}>
        <MaterialIcons name={icon} size={22} color="#D6005D" style={styles.infoIcon} />
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDD5E9",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: "#333",
    fontSize: 18,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#D6005D",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  logoutButton: {
    padding: 8,
  },
  
  // Profile Card
  profileCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    padding: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
  },
  editProfileButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 5,
  },
  
  // Info Section
  infoSection: {
    padding: 15,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  infoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabelText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: "#666",
  },
  
  // Account Actions
  accountActions: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F4",
    borderWidth: 1,
    borderColor: "#D6005D20",
    paddingVertical: 12,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "#D6005D",
    fontWeight: "600",
    marginLeft: 8,
  },
  
  // Edit Profile Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  photoSelector: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  modalPhoto: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  inputContainer: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#D6005D",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  
  // Confirm Delete Modal
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "85%",
    padding: 25,
    alignItems: "center",
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  confirmModalText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  confirmModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#D6005D",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});