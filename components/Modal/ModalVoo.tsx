import {
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const ModalVoo = ({ visible, voo, onClose, formatarData }) => {
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [dataReserva, setDataReserva] = useState("");

  if (!visible || !voo) return null;

  const reservarVoo = async () => {
    try {
      const idUsuario = await AsyncStorage.getItem("idUsuario");
      const token = await AsyncStorage.getItem("token");

      if (!idUsuario || !token) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(dataReserva)) {
        Alert.alert("Erro", "Por favor, insira a data no formato DD/MM/YYYY (ex.: 10/04/2025).");
        return;
      }

      const [dia, mes, ano] = dataReserva.split("/");
      const formattedDataReserva = `${ano}-${mes}-${dia}`;
      const reservaDate = new Date(formattedDataReserva);

      if (isNaN(reservaDate)) {
        Alert.alert("Erro", "Data inválida. Verifique os valores inseridos.");
        return;
      }

      const requestBody = {
        idVoos: voo.idVoos,
        idUsuario,
        data_reserva: formattedDataReserva,
      };

      console.log("Enviando requisição com body:", JSON.stringify(requestBody));
      console.log("Token:", token);
      console.log("URL:", "https://backend-viajados.vercel.app/api/reservas/voos");

      const response = await fetch(
        "https://backend-viajados.vercel.app/api/reservas/voos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Status da resposta:", response.status);
      const responseText = await response.text();
      console.log("Resposta do servidor (bruta):", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        Alert.alert(
          "Erro no servidor",
          `Não foi possível processar a resposta. Status: ${response.status}. Veja o console para detalhes.`
        );
        console.error("Erro ao parsear JSON:", parseError);
        return;
      }

      if (response.ok) {
        Alert.alert("Sucesso", "Reserva realizada com sucesso!");
        setModalReservaVisible(false);
        onClose();
      } else {
        Alert.alert("Erro", result.message || `Erro ao reservar voo (Status: ${response.status})`);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na requisição: " + error.message);
    }
  };

  const formatarDataInput = (text, setter) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formatted = "";
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = cleaned;
    }

    setter(formatted);
  };

  return (
    <View style={styles.containerModal}>
      <View style={styles.modalWrapper}>
        <ScrollView style={styles.conteudoModal}>
          <View style={styles.containerCarrossel}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {voo.imagens && Array.isArray(voo.imagens) ? (
                voo.imagens.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.imagemModal}
                  />
                ))
              ) : (
                <Text>Imagens não disponíveis</Text>
              )}
            </ScrollView>
          </View>
          <Text style={styles.tituloModal}>
            {voo.origem && voo.destino ? `${voo.origem} -> ${voo.destino}` : voo.destino || "Destino não informado"}
          </Text>
          <Text style={styles.textoInformacoes}>
            <Text style={{ fontWeight: "bold" }}>Preço:</Text> R$ {voo.preco}
          </Text>
          <Text style={styles.textoInformacoes}>
            <Text style={{ fontWeight: "bold" }}>Data:</Text>{" "}
            Consultar Disponibilidade
          </Text>
          <View style={styles.containerOferecimentos}>
            <Text style={styles.tituloOferecimentos}>O que o voo oferece:</Text>
            <View style={styles.containerConteudoOferecimentos}>
              <MaterialIcons name="local-airport" size={30} color="#D6005D" />
              <Text style={styles.textoOferecimentos}>Assento confortável</Text>
            </View>
            <View style={styles.containerConteudoOferecimentos}>
              <MaterialIcons name="wifi" size={30} color="#D6005D" />
              <Text style={styles.textoOferecimentos}>Wi-Fi</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setModalReservaVisible(true)}
            style={styles.botaoEscolher}
          >
            <Text style={styles.textoBotaoEscolher}>Escolher</Text>
          </Pressable>
        </ScrollView>
        <Pressable style={styles.closeIcon} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#000" />
        </Pressable>
      </View>

      {/* Modal de Reserva */}
      <Modal visible={modalReservaVisible} animationType="fade" transparent>
        <View style={styles.modalReservaContainer}>
          <View style={styles.modalReservaContent}>
            <Text style={styles.modalReservaTitle}>Escolha a Data de Reserva</Text>
            <Text style={styles.label}>Data da Reserva (DD/MM/YYYY):</Text>
            <TextInput
              style={styles.input}
              value={dataReserva}
              onChangeText={(text) => formatarDataInput(text, setDataReserva)}
              placeholder="10/04/2025"
              keyboardType="numeric"
              maxLength={10}
            />
            <View style={styles.buttonContainer}>
              <Button title="Reservar" onPress={reservarVoo} />
              <Button
                title="Cancelar"
                onPress={() => setModalReservaVisible(false)}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
  modalWrapper: {
    position: "relative",
    maxWidth: "90%",
    maxHeight: "80%",
  },
  conteudoModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 5,
  },
  tituloModal: {
    fontSize: 20,
    marginTop: 10, // Ajustado para dar espaço após os oferecimentos
    marginBottom: 10,
    fontWeight: "bold",
    color: "black",
  },
  containerCarrossel: {
    flexDirection: "row",
    marginBottom: 5,
  },
  imagemModal: {
    width: 250,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    marginTop:20
  },
  textoInformacoes: {
    fontSize: 16,
    marginBottom: 5,
  },
  containerOferecimentos: {
    display: "flex",
  },
  tituloOferecimentos: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#D6005D",
  },
  containerConteudoOferecimentos: {
    flexDirection: "row",
    alignItems: "center",
  },
  textoOferecimentos: {
    fontSize: 16,
    marginLeft: 10,
    color: "#555",
  },
  botaoEscolher: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#D6005D",
    borderRadius: 5,
    marginTop: 40, // Ajustado para dar espaço no final
  },
  textoBotaoEscolher: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalReservaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalReservaContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalReservaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D6005D",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  input: {
    width: "100%",
    height: 40,
    paddingLeft: 10,
    borderColor: "#D6005D",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ModalVoo;