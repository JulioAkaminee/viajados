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

export default function BannerVoo({
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
      <View style={{ position: "relative" }}>
        <Pressable onPress={favoritando} style={styles.iconeFavorito}>
          <MaterialIcons
            name={favorito ? "favorite" : "favorite-border"}
            size={24}
            color={favorito ? "#D6005D" : "#000"}
          />
        </Pressable>
        <Image source={imagem} style={styles.imagem} />
      </View>
      <Text style={styles.destino}>{destino}</Text>
      <Text style={styles.descricao}>{descricao}</Text>
      <Text style={styles.origem}>Origem: {origem}</Text>
      <Text style={styles.saida}>Saída: {saida}</Text>
      <Text style={styles.data}>Data: {data}</Text>
      <Text style={styles.texto}>Preço por pessoa</Text>
      <Text style={styles.preco}>{preco}</Text>
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
