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
  isLoading?: boolean;
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
          size={16}
          color={i <= avaliacao ? "#FFB800" : "#CCCCCC"}
        />
      );
    }
    return estrelas;
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.imagemContainer}>
        <Image source={imagem} style={styles.imagem} resizeMode="cover" />
      </View>
      
      <View style={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Text style={styles.nome} numberOfLines={1}>{nome}</Text>
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
                size={20}
                color={favorito ? "#D6005D" : "#666666"}
              />
            )}
          </Pressable>
        </View>
        
        <View style={styles.avaliacaoContainer}>
          <View style={styles.avaliacao}>{numeroEstrelas(avaliacao)}</View>
          <Text style={styles.avaliacaoTexto}>{avaliacao.toFixed(1)}</Text>
        </View>
        
        <Text style={styles.descricao} numberOfLines={2}>{descricao}</Text>
        
        <View style={styles.precoContainer}>
          <View>
            <Text style={styles.precoLabel}>Preço por pessoa</Text>
            <Text style={styles.preco}>R$ {preco}</Text>
          </View>
        </View>
          <Text style={styles.textoInfo}>Taxas e impostos não inclusos</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagemContainer: {
    width: 120,
    height: 190,
  },
  imagem: {
    width: "100%",
    height: "100%",
    objectFit:"cover"
  },
  conteudo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nome: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  iconeFavorito: {
    minWidth: 32,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
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
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  precoContainer: {
    marginTop: 4,
    flexDirection: "row",
  
  },
  precoLabel: {
    fontSize: 12,
    color: "#666666",
  },
  preco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  textoInfo: {
    fontSize: 10,
    color: "#999999",
    fontStyle: "italic",
   
  },
});