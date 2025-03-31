import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModalReserva({ visible, onClose, idHotel }) {
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [loading, setLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedIdUsuario = await AsyncStorage.getItem("idUsuario");
      const storedToken = await AsyncStorage.getItem("token");
      setIdUsuario(storedIdUsuario);
      setToken(storedToken);
    };
    fetchUserData();
  }, []);

  const reservarHotel = async () => {
    if (!dataEntrada || !dataSaida) {
      Alert.alert("Erro", "Por favor, preencha todas as datas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://backend-viajados.vercel.app/api/reservas/hospedagens/${idUsuario}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idHotel,
            idUsuario,
            data_entrada: dataEntrada,
            data_saida: dataSaida,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Reserva realizada com sucesso!");
        onClose();
      } else {
        Alert.alert("Erro", data.mensagem || "Falha ao reservar o hotel.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Reservar Hotel</Text>

          <Text>Data de Entrada:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={dataEntrada}
            onChangeText={setDataEntrada}
          />

          <Text>Data de Saída:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={dataSaida}
            onChangeText={setDataSaida}
          />

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={reservarHotel} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Confirmar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    backgroundColor: "#D6005D",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
