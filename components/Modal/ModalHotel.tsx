import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

const ModalHotel = ({ visible, hotel, onClose }) => {
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageScrollViewRef = useRef(null);

  if (!visible || !hotel) return null;

  const reservarHotel = async () => {
    try {
      const idUsuario = await AsyncStorage.getItem("idUsuario");
      const token = await AsyncStorage.getItem("token");

      if (!idUsuario || !token) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(dataEntrada) || !dateRegex.test(dataSaida)) {
        Alert.alert("Erro", "Por favor, insira as datas no formato DD/MM/YYYY (ex.: 10/04/2025).");
        return;
      }

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
        "https://backend-viajados.vercel.app/api/reservas/hospedagens",
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
        Alert.alert("Erro", result.message || `Erro ao reservar hotel (Status: ${response.status})`);
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

  const renderStar = (index, rating) => {
    return (
      <MaterialIcons
        key={index}
        name={index < rating ? "star" : "star-border"}
        size={18}
        color={index < rating ? "#FFD700" : "#aaa"}
        style={styles.starIcon}
      />
    );
  };

  const renderAmenity = (icon, text) => (
    <View style={styles.amenityItem}>
      <MaterialIcons name={icon} size={24} color="#D6005D" />
      <Text style={styles.amenityText}>{text}</Text>
    </View>
  );

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
    if (!hotel.imagens || !Array.isArray(hotel.imagens) || hotel.imagens.length === 0) return;
    
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentImageIndex(index);
  };

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  
  const calculateDays = () => {
    if (!dateRegex.test(dataEntrada) || !dateRegex.test(dataSaida)) return null;
    
    try {
      const [diaE, mesE, anoE] = dataEntrada.split("/");
      const [diaS, mesS, anoS] = dataSaida.split("/");
      
      const entrada = new Date(`${anoE}-${mesE}-${diaE}`);
      const saida = new Date(`${anoS}-${mesS}-${diaS}`);
      
      const diffTime = Math.abs(saida - entrada);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (e) {
      return null;
    }
  };

  const diasEstadia = calculateDays();
  const valorTotal = diasEstadia ? (hotel.preco_diaria * diasEstadia).toFixed(2) : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{hotel.nome}</Text>
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
                  {hotel.imagens && Array.isArray(hotel.imagens) && hotel.imagens.length > 0 ? (
                    hotel.imagens.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.hotelImage}
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
                {hotel.imagens && Array.isArray(hotel.imagens) && hotel.imagens.length > 0 && (
                  <View style={styles.imageDotContainer}>
                    {hotel.imagens.map((_, index) => renderImageDot(index))}
                  </View>
                )}
              </View>

              {/* Rating e Preço */}
              <View style={styles.detailsHeader}>
                <View style={styles.ratingContainer}>
                  {Array.from({ length: 5 }).map((_, i) => renderStar(i, hotel.avaliacao))}
                </View>
                <View style={styles.priceTag}>
                  <Text style={styles.priceLabel}>Diária</Text>
                  <Text style={styles.priceValue}>R$ {parseFloat(hotel.preco_diaria).toFixed(2)}</Text>
                </View>
              </View>

              {/* Descrição */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Descrição</Text>
                <Text style={styles.descriptionText}>{hotel.descricao}</Text>
              </View>

              {/* Amenidades */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>O que a hospedagem oferece</Text>
                <View style={styles.amenitiesContainer}>
                  {renderAmenity("ac-unit", "Ar-condicionado")}
                  {renderAmenity("pool", "Piscina")}
                  {renderAmenity("tv", "TV a cabo")}
                  {renderAmenity("wifi", "Wi-Fi")}
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
          <View style={styles.reserveModalContainer}>
            <View style={styles.reserveModalContent}>
              <View style={styles.reserveModalHeader}>
                <Text style={styles.reserveModalTitle}>Reservar Hospedagem</Text>
                <TouchableOpacity 
                  style={styles.reserveCloseButton} 
                  onPress={() => setModalReservaVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.hotelInfoCard}>
                <Text style={styles.hotelInfoName}>{hotel.nome}</Text>
                <View style={styles.hotelInfoDetails}>
                  <View style={styles.infoRating}>
                    {Array.from({ length: 5 }).map((_, i) => renderStar(i, hotel.avaliacao))}
                  </View>
                  <Text style={styles.hotelInfoPrice}>
                    R$ {parseFloat(hotel.preco_diaria).toFixed(2)} /noite
                  </Text>
                </View>
              </View>

              <View style={styles.dateInputSection}>
                <Text style={styles.dateInputTitle}>Selecione as datas</Text>
                
                <View style={styles.dateInput}>
                  <Text style={styles.dateInputLabel}>Data de check-in</Text>
                  <View style={styles.dateInputContainer}>
                    <MaterialIcons name="event" size={20} color="#666" style={styles.dateInputIcon} />
                    <TextInput
                      style={styles.dateInputField}
                      value={dataEntrada}
                      onChangeText={(text) => formatarDataInput(text, setDataEntrada)}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>
                </View>

                <View style={styles.dateInput}>
                  <Text style={styles.dateInputLabel}>Data de check-out</Text>
                  <View style={styles.dateInputContainer}>
                    <MaterialIcons name="event" size={20} color="#666" style={styles.dateInputIcon} />
                    <TextInput
                      style={styles.dateInputField}
                      value={dataSaida}
                      onChangeText={(text) => formatarDataInput(text, setDataSaida)}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>
                </View>
              </View>

              {diasEstadia && (
                <View style={styles.priceSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Valor da diária</Text>
                    <Text style={styles.summaryValue}>R$ {parseFloat(hotel.preco_diaria).toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Número de diárias</Text>
                    <Text style={styles.summaryValue}>{diasEstadia}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Valor total</Text>
                    <Text style={styles.totalValue}>R$ {valorTotal}</Text>
                  </View>
                </View>
              )}

              <View style={styles.reserveButtonsContainer}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setModalReservaVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={reservarHotel}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  imageContainer: {
    height: 240,
    position: 'relative',
  },
  hotelImage: {
    width: screenWidth * 0.9,
    height: 240,
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: screenWidth * 0.9,
    height: 240,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  imageDotContainer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  imageDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  priceTag: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D6005D',
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#555',
    lineHeight: 22,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 15,
  },
  amenityText: {
    marginLeft: 10,
    color: '#555',
  },
  reserveButton: {
    margin: 16,
    backgroundColor: '#D6005D',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Estilos para o Modal de Reserva
  reserveModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  reserveModalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  reserveModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reserveModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  reserveCloseButton: {
    padding: 4,
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotelInfoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  hotelInfoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  hotelInfoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRating: {
    flexDirection: 'row',
  },
  hotelInfoPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D6005D',
  },
  dateInputSection: {
    marginBottom: 20,
  },
  dateInputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dateInput: {
    marginBottom: 15,
  },
  dateInputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
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
    color: '#333',
  },
  priceSummary: {
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D6005D',
  },
  reserveButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#D6005D',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ModalHotel;