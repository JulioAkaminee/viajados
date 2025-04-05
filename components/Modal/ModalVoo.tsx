import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import React, { useRef, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

const ModalVoo = ({ visible, voo, onClose }) => {
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [dataReserva, setDataReserva] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageScrollViewRef = useRef(null);

  if (!visible || !voo) return null;
  console.log("Data digitada pelo usuário:", dataReserva);

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
      const formattedDataReserva = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")} 08:00:00`;

      const reservaDate = new Date(`${ano}-${mes}-${dia}T08:00:00.000Z`);
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
        Alert.alert("Erro", result.message || "Erro ao reservar voo");
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

  const renderImageDot = (index) => (
    <View
      key={index}
      style={[
        styles.imageDot,
        currentImageIndex === index && styles.imageDotActive,
      ]}
    />
  );

  const handleScroll = (event) => {
    if (!voo.imagens || !Array.isArray(voo.imagens) || voo.imagens.length === 0) return;

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentImageIndex(index);
  };

  const renderAmenity = (icon, text) => (
    <View style={styles.amenityItem}>
      <MaterialIcons name={icon} size={24} color="#D6005D" />
      <Text style={styles.amenityText}>{text}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />

          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {voo.origem && voo.destino ? `${voo.origem} → ${voo.destino}` : voo.destino || "Destino não informado"}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <MaterialIcons name="close" size={28} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Imagens */}
                <View style={styles.imageContainer}>
                  <ScrollView
                    ref={imageScrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                  >
                    {voo.imagens && Array.isArray(voo.imagens) && voo.imagens.length > 0 ? (
                      voo.imagens.map((image, index) => (
                        <Image
                          key={index}
                          source={{ uri: image }}
                          style={styles.vooImage}
                        />
                      ))
                    ) : (
                      <View style={styles.noImageContainer}>
                        <MaterialIcons name="image-not-supported" size={60} color="#ddd" />
                        <Text style={styles.noImageText}>Imagens não disponíveis</Text>
                      </View>
                    )}
                  </ScrollView>

                  {/* Indicadores de imagem */}
                  {voo.imagens && Array.isArray(voo.imagens) && voo.imagens.length > 0 && (
                    <View style={styles.imageDotContainer}>
                      {voo.imagens.map((_, index) => renderImageDot(index))}
                    </View>
                  )}
                </View>

                {/* Preço */}
                <View style={styles.detailsHeader}>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceLabel}>Preço</Text>
                    <Text style={styles.priceValue}>R$ {parseFloat(voo.preco).toFixed(2)}</Text>
                  </View>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateInfoLabel}>Data:</Text>
                    <Text style={styles.dateInfoValue}>Consultar Disponibilidade</Text>
                  </View>
                </View>

                {/* Amenidades */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>O que o voo oferece</Text>
                  <View style={styles.amenitiesContainer}>
                    {renderAmenity("local-airport", "Assento confortável")}
                    {renderAmenity("wifi", "Wi-Fi")}
                    {renderAmenity("restaurant", "Serviço de bordo")}
                    {renderAmenity("movie", "Entretenimento a bordo")}
                  </View>
                </View>

                {/* Botão Reservar */}
                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={() => setModalReservaVisible(true)}
                >
                  <Text style={styles.reserveButtonText}>Reservar</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>

          {/* Modal de Reserva */}
          <Modal visible={modalReservaVisible} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.reserveModalContainer}>
                <View style={styles.reserveModalContent}>
                  <View style={styles.reserveModalHeader}>
                    <Text style={styles.reserveModalTitle}>Reservar Voo</Text>
                    <TouchableOpacity
                      style={styles.reserveCloseButton}
                      onPress={() => setModalReservaVisible(false)}
                    >
                      <MaterialIcons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.vooInfoCard}>
                    <Text style={styles.vooInfoName}>
                      {voo.origem && voo.destino ? `${voo.origem} → ${voo.destino}` : voo.destino || "Destino não informado"}
                    </Text>
                    <Text style={styles.vooInfoPrice}>
                      R$ {parseFloat(voo.preco).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.dateInputSection}>
                    <Text style={styles.dateInputTitle}>Selecione a data</Text>

                    <View style={styles.dateInput}>
                      <Text style={styles.dateInputLabel}>Data da reserva</Text>
                      <View style={styles.dateInputContainer}>
                        <MaterialIcons name="event" size={20} color="#666" style={styles.dateInputIcon} />
                        <TextInput
                          style={styles.dateInputField}
                          value={dataReserva}
                          onChangeText={(text) => formatarDataInput(text, setDataReserva)}
                          placeholder="DD/MM/AAAA"
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                          maxLength={10}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.priceSummary}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Valor da passagem</Text>
                      <Text style={styles.summaryValue}>R$ {parseFloat(voo.preco).toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                      <Text style={styles.totalLabel}>Valor total</Text>
                      <Text style={styles.totalValue}>R$ {parseFloat(voo.preco).toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.reserveButtonsContainer}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setModalReservaVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={reservarVoo}
                    >
                      <Text style={styles.confirmButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  imageContainer: {
    height: 240,
    position: "relative",
  },
  vooImage: {
    width: screenWidth * 0.9,
    height: 240,
    resizeMode: "cover",
  },
  noImageContainer: {
    width: screenWidth * 0.9,
    height: 240,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  imageDotContainer: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  imageDotActive: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priceTag: {
    alignItems: "flex-start",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D6005D",
  },
  dateInfo: {
    alignItems: "flex-end",
  },
  dateInfoLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  dateInfoValue: {
    fontSize: 14,
    color: "#555",
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 15,
  },
  amenityText: {
    marginLeft: 10,
    color: "#555",
  },
  reserveButton: {
    margin: 16,
    backgroundColor: "#D6005D",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reserveModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  reserveModalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  reserveModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  reserveModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  reserveCloseButton: {
    padding: 4,
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  vooInfoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  vooInfoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  vooInfoPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D6005D",
  },
  dateInputSection: {
    marginBottom: 20,
  },
  dateInputTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  dateInput: {
    marginBottom: 15,
  },
  dateInputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  dateInputIcon: {
    marginRight: 10,
  },
  dateInputField: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  priceSummary: {
    backgroundColor: "#f5f7fa",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D6005D",
  },
  reserveButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#D6005D",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginLeft: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ModalVoo;