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
  nome: string;
  avaliacao: number;
  inicio: string;
  fim: string;
  descricao: string;
  preco: string;
  onPress: () => void;
};

export default function BannerHotelFavoritos({
  imagem,
  nome,
  avaliacao,
  inicio,
  fim,
  descricao,
  preco,
  onPress,
}: Props) {
  const [favorito, setFavorito] = useState(false);

  const favoritando = () => {
    setFavorito((prev) => !prev);
  };

  const numeroEstrelas = (avaliacao: number) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <MaterialIcons
          key={i}
          name={i <= avaliacao ? "star" : "star-border"}
          size={14}
          color="#000"
        />
      );
    }
    return estrelas;
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
        <Text style={styles.nome}>{nome}</Text>
        <View style={styles.avaliacao}>{numeroEstrelas(avaliacao)}</View>
        <Text style={styles.descricao}>{descricao}</Text>
        <Text style={styles.inicio}>Início: {inicio}</Text>
        <Text style={styles.fim}>Fim: {fim}</Text>
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
  nome: {
    fontWeight: "bold",
    fontSize: 12,
    top: 4,
    marginBottom: 5,
  },
  avaliacao: {
    position: "absolute",
    flexDirection: "row",
    top: 5,
    right: 30,
  },
  descricao: {
    fontSize: 12,
    maxWidth: "95%",
    marginBottom: 2,
  },
  inicio: {
    fontSize: 12,
    marginBottom: 2,
  },
  fim: {
    fontSize: 12,
    marginBottom: 2,
  },
  texto: {
    fontSize: 12,
    marginBottom: 5,
  },
  preco: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
});
