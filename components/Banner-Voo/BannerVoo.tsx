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
  destino: string;
  origem: string;
  data: string;
  preco: string;
  favorito: boolean;
  onFavoritar: () => void;
  onPress: () => void;
  isLoading?: boolean;
};

export default function BannerVoo({
  imagem,
  destino,
  origem,
  data,
  preco,
  favorito,
  onFavoritar,
  onPress,
  isLoading = false,
}: Props) {
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
              name={favorito ? "favorite" : "favorite-border"}
              size={22}
              color={favorito ? "#D6005D" : "#FFFFFF"}
            />
          )}
        </Pressable>
        <View style={styles.precoTag}>
          <Text style={styles.precoTexto}>R$ {preco}</Text>
          <Text style={styles.precoSubtexto}>por pessoa</Text>
        </View>
      </View>
      
      <View style={styles.conteudo}>
        <View style={styles.destinoContainer}>
          <View style={styles.rotaContainer}>
            <Text style={styles.origem}>{origem}</Text>
            <MaterialIcons name="flight" size={16} color="#666666" style={styles.iconeVoo} />
            <Text style={styles.destino}>{destino}</Text>
          </View>
        </View>
        
        <View style={styles.rodape}>
          <Text style={styles.textoInfo}>Taxas e impostos não inclusos</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%", // Garante que o banner ocupe toda a largura do pai
  },
  imagemContainer: {
    position: "relative",
    height: 180,
  },
  imagem: {
    width: "100%", // Garante que a imagem ocupe toda a largura
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
  destinoContainer: {
    marginBottom: 10,
  },
  rotaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  origem: {
    fontWeight: "bold",
    fontSize: 16,
  },
  iconeVoo: {
    marginHorizontal: 8,
    transform: [{ rotate: "90deg" }],
  },
  destino: {
    fontWeight: "bold",
    fontSize: 16,
  },
  data: {
    color: "#666666",
    fontSize: 14,
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