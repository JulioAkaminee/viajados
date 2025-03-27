import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  imagem: ImageSourcePropType;
  nome: string;
  avaliacao: number;
  descricao: string;
  preco: string;
  favorito: boolean;
  onFavoritar: () => void;
  onPress: () => void;
  isFavoritando?: boolean;
};

export default function BannerHotel({
  imagem,
  nome,
  avaliacao,
  descricao,
  preco,
  favorito,
  onFavoritar,
  onPress,
  isFavoritando = false,
}: Props) {
  const numeroEstrelas = (avaliacao: number) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <MaterialIcons
          key={i}
          name={i <= avaliacao ? "star" : "star-border"}
          size={24}
          color="#000"
        />
      );
    }
    return estrelas;
  };

  const isFavorito = !!favorito;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{ position: "relative" }}>
        <Pressable
          onPress={onFavoritar}
          style={styles.iconeFavorito}
          disabled={isFavoritando}
        >
          <MaterialIcons
            name={isFavorito ? "favorite" : "favorite-border"}
            size={24}
            color={isFavorito ? "#D6005D" : "#000"}
          />
        </Pressable>
        <Image source={imagem} style={styles.imagem} />
      </View>
      <Text style={styles.nome}>{nome}</Text>
      <View style={styles.avaliacao}>{numeroEstrelas(avaliacao)}</View>
      <Text style={styles.descricao}>{descricao}</Text>
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
  },
  nome: {
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 2,
  },
  avaliacao: {
    flexDirection: "row",
    marginHorizontal: 7,
    marginBottom: 5,
  },
  descricao: {
    textAlign: "left",
    marginHorizontal: 10,
    marginBottom: 5,
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
