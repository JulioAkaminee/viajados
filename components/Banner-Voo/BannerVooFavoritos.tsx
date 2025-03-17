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
  descricao: string;
  preco: string;
  onPress: () => void;
};

export default function BannerHotelFavoritos({
  imagem,
  destino,
  origem,
  saida,
  data,
  descricao,
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
            size={24}
            color={favorito ? "#000" : "#D6005D"}
          />
        </Pressable>
        <Text style={styles.destino}>{destino}</Text>
        <Text style={styles.descricao}>{descricao}</Text>
        <Text>Origem: {origem}</Text>
        <Text>Saída: {saida}</Text>
        <Text>Data: {data}</Text>
        <Text>Preço por pessoa</Text>
        <Text style={styles.preco}>{preco}</Text>
        <Text>Taxas e impostos não inclusos.</Text>
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
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    margin: 10,
    elevation: 3,
  },
  imagem: {
    width: 120,
    height: "100%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  iconeFavorito: {
    position: "absolute",
    right: 0,
    backgroundColor: "#fff",
    borderEndStartRadius: 15,
    padding: 5,
    elevation: 5,
    zIndex: 1,
  },
  destino: {
    fontWeight: "bold",
    fontSize: 16,
    top: 4,
    marginBottom: 3,
  },
  descricao: {
    maxWidth: "95%",
  },
  preco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
