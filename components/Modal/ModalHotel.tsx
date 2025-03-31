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

const ModalHotel = ({ visible, hotel, onClose }) => {
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");

  if (!visible || !hotel) return null;

  const reservarHotel = async () => {
    try {
      const idUsuario = await AsyncStorage.getItem("idUsuario");
      const token = await AsyncStorage.getItem("token");

      if (!idUsuario || !token) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      // Validação do formato da data (DD/MM/YYYY)
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(dataEntrada) || !dateRegex.test(dataSaida)) {
        Alert.alert("Erro", "Por favor, insira as datas no formato DD/MM/YYYY (ex.: 10/04/2025).");
        return;
      }

      // Converte DD/MM/YYYY para YYYY-MM-DD
      const [diaE, mesE, anoE] = dataEntrada.split("/");
      const [diaS, mesS, anoS] = dataSaida.split("/");
      const formattedDataEntrada = `${anoE}-${mesE}-${diaE}`;
      const formattedDataSaida = `${anoS}-${mesS}-${diaS}`;

      const entradaDate = new Date(formattedDataEntrada);
      const saidaDate = new Date(formattedDataSaida);

      if (isNaN(entradaDate) || isNaN(saidaDate)) {
        Alert.alert("Erro", "Datas inválidas. Verifique os valores inseridos.");
        return;
      }

      if (saidaDate <= entradaDate) {
        Alert.alert("Erro", "A data de saída deve ser posterior à data de entrada.");
        return;
      }

      const requestBody = {
        idHoteis: hotel.idHoteis,
        idUsuario,
        data_entrada: formattedDataEntrada,
        data_saida: formattedDataSaida,
      };

      console.log("Enviando requisição com body:", JSON.stringify(requestBody));
      console.log("Token:", token);
      console.log("URL:", "https://backend-viajados.vercel.app/api/reservas/hospedagens");

      const response = await fetch(
        "https://backend-viajados.vercel.app/api/reservas/hospedagens", // Corrigido para a rota correta
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Log do status e resposta bruta
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
        Alert.alert("Erro", result.message || `Erro ao reservar hotel (Status: ${response.status})`);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na requisição: " + error.message);
    }
  };

  const formatarDataInput = (text, setter) => {
    // Remove tudo exceto números
    let cleaned = text.replace(/\D/g, "");

    // Limita a 8 dígitos (DDMMYYYY)
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    // Adiciona barras automaticamente
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
      <ScrollView style={styles.conteudoModal}>
        <Text style={styles.tituloModal}>{hotel.nome}</Text>
        <View style={styles.containerCarrossel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hotel.imagens && Array.isArray(hotel.imagens) ? (
              hotel.imagens.map((image, index) => (
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
        <View style={styles.containerInformacoes}>
          <Text style={styles.textoInformacoes}>
            <Text style={{ fontWeight: "bold" }}>Preço:</Text> R${" "}
            {hotel.preco_diaria}
          </Text>
          <Text style={styles.textoInformacoes}>
            <Text style={{ fontWeight: "bold" }}>Descrição:</Text>{" "}
            {hotel.descricao}
          </Text>
        </View>
        <View style={styles.containerAvaliacao}>
          {Array.from({ length: 5 }).map((_, i) => (
            <MaterialIcons
              key={i}
              name={i < hotel.avaliacao ? "star" : "star-border"}
              size={24}
              color="#000"
              style={styles.estrela}
            />
          ))}
        </View>
        <View style={styles.containerOferecimentos}>
          <Text style={styles.tituloOferecimentos}>
            O que a hospedagem oferece:
          </Text>
          <View style={styles.containerConteudoOferecimentos}>
            <MaterialIcons name="ac-unit" size={30} color="#D6005D" />
            <Text style={styles.textoOferecimentos}>Ar-condicionado</Text>
          </View>
          <View style={styles.containerConteudoOferecimentos}>
            <MaterialIcons name="pool" size={30} color="#D6005D" />
            <Text style={styles.textoOferecimentos}>Piscina</Text>
          </View>
          <View style={styles.containerConteudoOferecimentos}>
            <MaterialIcons name="tv" size={30} color="#D6005D" />
            <Text style={styles.textoOferecimentos}>TV a cabo</Text>
          </View>
          <View style={styles.containerConteudoOferecimentos}>
            <MaterialIcons name="wifi" size={30} color="#D6005D" />
            <Text style={styles.textoOferecimentos}>Wifi</Text>
          </View>
        </View>
        <Pressable
          onPress={() => setModalReservaVisible(true)}
          style={styles.botaoEscolher}
        >
          <Text style={styles.textoBotaoEscolher}>Escolher</Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.botaoFechar}>
          <Text style={styles.textoBotaoFechar}>Fechar</Text>
        </Pressable>
      </ScrollView>

      {/* Modal de Reserva */}
      <Modal visible={modalReservaVisible} animationType="slide" transparent>
        <View style={styles.modalReservaContainer}>
          <View style={styles.modalReservaContent}>
            <Text style={styles.modalReservaTitle}>Escolha as Datas</Text>

            <Text style={styles.label}>Data de Entrada (DD/MM/YYYY):</Text>
            <TextInput
              style={styles.input}
              value={dataEntrada}
              onChangeText={(text) => formatarDataInput(text, setDataEntrada)}
              placeholder="10/04/2025"
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.label}>Data de Saída (DD/MM/YYYY):</Text>
            <TextInput
              style={styles.input}
              value={dataSaida}
              onChangeText={(text) => formatarDataInput(text, setDataSaida)}
              placeholder="15/04/2025"
              keyboardType="numeric"
              maxLength={10}
            />

            <View style={styles.buttonContainer}>
              <Button title="Reservar" onPress={reservarHotel} />
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
  conteudoModal: {
    maxWidth: "90%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  tituloModal: {
    fontSize: 20,
    marginBottom: 2,
    fontWeight: "bold",
  },
  containerAvaliacao: {
    flexDirection: "row",
    marginBottom: 10,
  },
  estrela: {
    fontSize: 20,
    marginRight: 3,
  },
  containerCarrossel: {
    flexDirection: "row",
    marginBottom: 5,
  },
  imagemModal: {
    width: 250,
    height: 150,
    marginRight: 10,
    borderRadius: 5,
  },
  containerInformacoes: {
    alignItems: "flex-start",
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
  },
  textoBotaoEscolher: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoFechar: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
    marginBottom: 30,
  },
  textoBotaoFechar: {
    color: "#000",
    fontWeight: "bold",
  },
  modalReservaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalReservaContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalReservaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default ModalHotel;