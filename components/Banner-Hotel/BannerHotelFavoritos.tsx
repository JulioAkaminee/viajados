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

type Props = {
  imagem: ImageSourcePropType;
  nome: string;
  avaliacao: number;
  descricao: string;
  preco: string;
  onPress: () => void;
  onDesfavoritar: () => void;
  isLoading?: boolean; // Adicionado para controle de loading
};

export default function BannerHotelFavoritos({
  imagem,
  nome,
  avaliacao,
  descricao,
  preco,
  onPress,
  onDesfavoritar,
  isLoading = false,
}: Props) {
  const [favorito, setFavorito] = useState(true);

  const handleDesfavoritar = () => {
    if (!isLoading) {
      setFavorito(false);
      onDesfavoritar();
    }
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
        <Text style={styles.nome}>{nome}</Text>
        <View style={styles.avaliacao}>{numeroEstrelas(avaliacao)}</View>
        <Text style={styles.descricao}>{descricao}</Text>
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
    minWidth: 28, // Adicionado para consistência durante loading
    minHeight: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  nome: {
    fontWeight: "bold",
    fontSize: 12,
    top: 4,
    marginBottom: 5,
  },
  avaliacao: {
    flexDirection: "row",
  },
  descricao: {
    fontSize: 12,
    maxWidth: "95%",
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