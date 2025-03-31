import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

type Props = {
  imagem: ImageSourcePropType;
  destino: string;
  origem: string;
  data: string;
  preco: string;
  favorito: boolean;
  onFavoritar: () => void;
  onPress: () => void;
  isLoading?: boolean; // Adicionado para controle do loading
};

export default function BannerVoo({
  imagem,
  destino,
  origem,
  data,
  preco,
  favorito,
  onFavoritar,
  onPress,
  isLoading = false,
}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{ position: "relative" }}>
        <Pressable 
          onPress={onFavoritar} 
          style={styles.iconeFavorito}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#D6005D" />
          ) : (
            <MaterialIcons
              name={favorito ? "favorite" : "favorite-border"}
              size={24}
              color={favorito ? "#D6005D" : "#000"}
            />
          )}
        </Pressable>
        <Image source={imagem} style={styles.imagem} />
      </View>
      <Text style={styles.destino}>{destino}</Text>
      <Text style={styles.origem}>Origem: {origem}</Text>
      <Text style={styles.data}>Data: {data}</Text>
      <Text style={styles.texto}>Preço por pessoa</Text>
      <Text style={styles.preco}>R$ {preco}</Text>
      <Text style={[styles.texto, { marginBottom: 10 }]}>
        Taxas e impostos não inclusos.
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    margin: 10,
  },
  imagem: {
    width: "100%",
    height: 150,
  },
  iconeFavorito: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    borderStartEndRadius: 10,
    padding: 4,
    elevation: 5,
    zIndex: 1,
    minWidth: 32, // Adicionado para manter consistência no tamanho durante loading
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  destino: {
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 2,
  },
  descricao: {
    textAlign: "left",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  origem: {
    textAlign: "left",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  saida: {
    textAlign: "left",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  data: {
    textAlign: "left",
    marginHorizontal: 10,
  },
  texto: {
    textAlign: "left",
    marginHorizontal: 10,
    marginTop: 5,
  },
  preco: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
    marginHorizontal: 10,
  },
});