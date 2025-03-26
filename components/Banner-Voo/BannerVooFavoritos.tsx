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
  data: string;
  preco: string;
  onPress: () => void;
  onDesfavoritar: () => void; // Substituído onFavoritar por onDesfavoritar
};

export default function BannerVooFavoritos({
  imagem,
  destino,
  origem,
  data,
  preco,
  onPress,
  onDesfavoritar,
}: Props) {
  const [favorito, setFavorito] = useState(true); // Inicia como true, pois está na página de favoritos

  const handleDesfavoritar = () => {
    setFavorito(false); // Atualiza o estado local
    onDesfavoritar(); // Chama a função passada pelo componente pai para remover do backend
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };


  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={imagem} style={styles.imagem} />
      <View style={styles.conteudo}>
        <Pressable onPress={handleDesfavoritar} style={styles.iconeFavorito}>
          <MaterialIcons
            name={favorito ? "favorite" : "favorite-border"} // Mostra "favorite" enquanto favoritado
            size={18}
            color={favorito ? "#D6005D" : "#000"} // Rosa quando favoritado, preto quando não
          />
        </Pressable>
        <Text style={styles.destino}>{destino}</Text>
        <Text style={styles.origem}>Origem: {origem}</Text>
        <Text style={styles.data}>Data: {formatarData(data)}</Text>
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
  },
  destino: {
    fontWeight: "bold",
    fontSize: 12,
    top: 4,
    marginBottom: 6,
  },
  origem: {
    fontSize: 12,
    marginBottom: 4,
  },
  saida: {
    fontSize: 12,
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    marginBottom: 4,
  },
  texto: {
    fontSize: 12,
    marginBottom: 4,
  },
  preco: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
});