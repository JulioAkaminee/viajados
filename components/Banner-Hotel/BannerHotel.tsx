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

export default function BannerHotel({
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
          size={24}
          color="#000"
        />
      );
    }
    return estrelas;
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
      <Text style={styles.nome}>{nome}</Text>
      <View style={styles.avaliacao}>{numeroEstrelas(avaliacao)}</View>
      <Text style={styles.descricao}>{descricao}</Text>
      <Text style={styles.inicio}>Início: {inicio}</Text>
      <Text style={styles.fim}>Fim: {fim}</Text>
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
    borderEndStartRadius: 10,
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
  inicio: {
    textAlign: "left",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  fim: {
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
