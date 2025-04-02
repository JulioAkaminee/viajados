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
  destino: string;
  origem: string;
  data: string;
  preco: string;
  onPress: () => void;
  onDesfavoritar: () => void;
  isLoading?: boolean;
};

export default function BannerVooFavoritos({
  imagem,
  destino,
  origem,
  data,
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

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.imagemContainer}>
        <Image source={imagem} style={styles.imagem} resizeMode="cover" />
      </View>
      <View style={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Text style={styles.destino} numberOfLines={1}>{`${origem} → ${destino}`}</Text>
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

        <Text style={styles.data}>Data: {data || "Consultar Disponibilidade"}</Text>
        <View style={styles.precoContainer}>
          <Text style={styles.precoLabel}>Preço por pessoa</Text>
          <Text style={styles.preco}>R$ {preco}</Text>
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
    height: 140,
  },
  imagem: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  conteudo: {
    flex: 1,
    padding: 10,

  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  destino: {
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
  data: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 6,
  },
  precoContainer: {
    marginTop: 4,
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