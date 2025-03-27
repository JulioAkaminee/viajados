import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

const ModalVoo = ({ visible, voo, onClose, formatarData }) => {
  if (!visible || !voo) return null;

  return (
    <View style={styles.containerModal}>
      <ScrollView style={styles.conteudoModal}>
        <Text style={styles.tituloModal}>
          {voo.destino || "Destino não informado"}
        </Text>
        <View style={styles.containerCarrossel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {voo.imagens && Array.isArray(voo.imagens) ? (
              voo.imagens.map((image, index) => (
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
        <Text style={styles.textoInformacoes}>
          <Text style={{ fontWeight: "bold" }}>Origem:</Text> {voo.origem}
        </Text>
        <Text style={styles.textoInformacoes}>
          <Text style={{ fontWeight: "bold" }}>Preço:</Text> R$ {voo.preco}
        </Text>
        <Text style={styles.textoInformacoes}>
          <Text style={{ fontWeight: "bold" }}>Data:</Text>{" "}
          {formatarData(voo.data)}
        </Text>
        <View style={styles.containerOferecimentos}>
          <Text style={styles.tituloOferecimentos}>O que o voo oferece:</Text>
          <View style={styles.containerConteudoOferecimentos}>
            <MaterialIcons name="airplane-ticket" size={30} color="#D6005D" />
            <Text style={styles.textoOferecimentos}>Classe Econômica</Text>
          </View>
          <View style={styles.containerConteudoOferecimentos}>
            <MaterialIcons name="ac-unit" size={30} color="#D6005D" />
            <Text style={styles.textoOferecimentos}>Ar-condicionado</Text>
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

export default ModalVoo;