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
  nome: string;
  avaliacao: number;
  descricao: string;
  preco: string;
  favorito: boolean;
  onFavoritar: () => void;
  onPress: () => void;
  isLoading?: boolean;
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
  isLoading = false,
}: Props) {
  const numeroEstrelas = (avaliacao: number) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <MaterialIcons
          key={i}
          name={i <= avaliacao ? "star" : "star-border"}
          size={18}
          color={i <= avaliacao ? "#FFB800" : "#CCCCCC"}
        />
      );
    }
    return estrelas;
  };

  const isFavorito = !!favorito;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.imagemContainer}>
        <Image source={imagem} style={styles.imagem} resizeMode="cover" />
        <Pressable
          onPress={onFavoritar}
          style={styles.iconeFavorito}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#D6005D" />
          ) : (
            <MaterialIcons
              name={isFavorito ? "favorite" : "favorite-border"}
              size={22}
              color={isFavorito ? "#D6005D" : "#FFFFFF"}
            />
          )}
        </Pressable>
        <View style={styles.precoTag}>
          <Text style={styles.precoTexto}>R$ {preco}</Text>
          <Text style={styles.precoSubtexto}>por pessoa</Text>
        </View>
      </View>
      
      <View style={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Text style={styles.nome} numberOfLines={1}>{nome}</Text>
          <View style={styles.avaliacaoContainer}>
            <View style={styles.avaliacao}>{numeroEstrelas(avaliacao)}</View>
            <Text style={styles.avaliacaoTexto}>{avaliacao.toFixed(1)}</Text>
          </View>
        </View>
        
        <Text style={styles.descricao} numberOfLines={2}>{descricao}</Text>
        
        <View style={styles.rodape}>
          <Text style={styles.textoInfo}>Taxas e impostos não inclusos</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagemContainer: {
    position: "relative",
    height: 180,
  },
  imagem: {
    width: "100%",
    height: "100%",
  },
  iconeFavorito: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
    minWidth: 38,
    minHeight: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  precoTag: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderTopRightRadius: 12,
  },
  precoTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  precoSubtexto: {
    color: "#DDDDDD",
    fontSize: 12,
  },
  conteudo: {
    padding: 14,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nome: {
    fontWeight: "bold",
    fontSize: 18,
    flex: 1,
    marginRight: 8,
  },
  avaliacaoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avaliacao: {
    flexDirection: "row",
    marginRight: 4,
  },
  avaliacaoTexto: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#666666",
  },
  descricao: {
    color: "#666666",
    marginBottom: 10,
    lineHeight: 20,
  },
  rodape: {
    marginTop: 6,
  },
  textoInfo: {
    fontSize: 12,
    color: "#999999",
    fontStyle: "italic",
  },
});