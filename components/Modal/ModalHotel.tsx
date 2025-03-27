import {
  Image,
  Modl,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

const ModalHotel = ({ visible, hotel, onClose }) => {
  if (!visible || !hotel) return null;

  return (
    <View style={styles.containerModal} >
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
                  onError={(e) =>
                    console.log(
                      `Erro ao carregar imagem: ${image}`,
                      e.nativeEvent.error
                    )
                  }
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
        <Pressable onPress={() => {}} style={styles.botaoEscolher}>
          <Text style={styles.textoBotaoEscolher}>Escolher</Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.botaoFechar}>
          <Text style={styles.textoBotaoFechar}>Fechar</Text>
        </Pressable>
      </ScrollView>
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
});

export default ModalHotel;