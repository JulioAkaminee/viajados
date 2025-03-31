import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";

import { MaterialIcons } from "@expo/vector-icons";

export default function BannerVooFavoritos({
  imagem,
  destino,
  origem,
  data,
  preco,
  onPress,
  onDesfavoritar,
  isLoading = false,
}) {
  const [favorito, setFavorito] = useState(true);

  const handleDesfavoritar = () => {
    if (!isLoading) {
      setFavorito(false);
      onDesfavoritar();
    }
  };

 

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={imagem} style={styles.imagem} />
      <View style={styles.conteudo}>
        <Pressable 
          onPress={handleDesfavoritar} 
          style={styles.iconeFavorito}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#D6005D" />
          ) : (
            <MaterialIcons
              name={favorito ? "favorite" : "favorite-border"}
              size={18}
              color={favorito ? "#D6005D" : "#000"}
            />
          )}
        </Pressable>
        <Text style={styles.destino}>{destino}</Text>
        <Text style={styles.origem}>Origem: {origem}</Text>
        <Text style={styles.data}>Data: {data}</Text>
        <Text style={styles.texto}>Preço por pessoa</Text>
        <Text style={styles.preco}>R$ {preco}</Text>
        <Text style={styles.texto}>Taxas e impostos não inclusos.</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginVertical: 10,
    elevation: 3,
  },
  imagem: {
    width: 120,
    height: "100%",
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  iconeFavorito: {
    position: "absolute",
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 3,
    paddingHorizontal: 5,
    zIndex: 1,
    minWidth: 28,
    minHeight: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  destino: {
    fontWeight: "bold",
    fontSize: 12,
    top: 4,
    marginBottom: 6,
  },
  origem: {
    fontSize: 12,
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    marginBottom: 4,
  },
  texto: {
    fontSize: 12,
    marginBottom: 4,
  },
  preco: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
});