import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Image,
  ImageSourcePropType,
} from "react-native";

type Props = {
  imagem: ImageSourcePropType;
  destino: string;
  origem: string;
  saida: string;
  data: string;
  preco: string;
  onPress: () => void;
};

export default function BannerHotelFavoritos({
  imagem,
  destino,
  origem,
  saida,
  data,
  preco,
  onPress,
}: Props) {
  const [favorito, setFavorito] = useState(false);

  const favoritando = () => {
    setFavorito((prev) => !prev);
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={imagem} style={styles.imagem} />
      <View style={styles.conteudo}>
        <Pressable onPress={favoritando} style={styles.iconeFavorito}>
          <MaterialIcons
            name={favorito ? "favorite-border" : "favorite"}
            size={18}
            color={favorito ? "#000" : "#D6005D"}
          />
        </Pressable>
        <Text style={styles.destino}>{destino}</Text>
        <Text style={styles.origem}>Origem: {origem}</Text>
        <Text style={styles.saida}>Saída: {saida}</Text>
        <Text style={styles.data}>Data: {data}</Text>
        <Text style={styles.texto}>Preço por pessoa</Text>
        <Text style={styles.preco}>{preco}</Text>
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
    marginVertical:10,
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
  saida: {
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
