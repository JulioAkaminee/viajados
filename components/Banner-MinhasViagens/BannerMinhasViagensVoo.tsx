import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

type VooData = {
    idReserva: number;
    idVoos: number;
    data_reserva: string;
    status: string;
    origem: string;
    destino: string;
    preco: string;
    data_voo: string;
  };
  
  type Props = {
    vooData: VooData;
    onPress: () => void;
    isLoading?: boolean;
  };
  
  export default function BannerMinhasViagensVoo({
    vooData,
    onPress,
    isLoading = false,
  }: Props) {
    const { origem, destino, preco, status, data_voo } = vooData;
  
    // Função para formatar a data
    const formatDate = (date: string) => {
      const formattedDate = new Date(date);
      if (isNaN(formattedDate.getTime())) return "Data inválida"; 
      return formattedDate.toLocaleDateString("pt-BR", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };
  
    // Função para formatar o preço (caso seja um número)
    const formatPrice = (price: string) => {
      const formattedPrice = parseFloat(price);
      if (isNaN(formattedPrice)) return "Preço Indefinido"; 
      return `R$ ${formattedPrice.toFixed(2)}`; 
    };
  
    return (
      <Pressable onPress={onPress} style={styles.container}>
        <View style={styles.content}>
          {isLoading && <ActivityIndicator size="small" color="#D6005D" />}
  
          {/* Ícone de Avião no topo */}
          <View style={styles.iconeVoo}>
            <MaterialIcons name="flight-takeoff" size={40} color="#D6005D" />
          </View>
  
          {/* Origem e Destino */}
          <Text style={styles.origemDestino}>
            {origem || "Origem Indefinida"} → {destino || "Destino Indefinido"}
          </Text>
  
          {/* Data do voo */}
          <Text style={styles.dataVoo}>{formatDate(data_voo)}</Text>
  
          {/* Preço */}
          <Text style={styles.preco}>{formatPrice(preco)}</Text>
  
          {/* Status */}
          <Text style={[styles.texto, styles.status]}>Status: {status}</Text>
        </View>
      </Pressable>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: 350,
      backgroundColor: "#fff",
      borderRadius: 10,
      overflow: "hidden",
      marginVertical: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    content: {
      padding: 15,
      alignItems: "flex-start",
    },
    iconeVoo: {
      marginBottom: 10, 
    },
    origemDestino: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 5,
    },
    dataVoo: {
      fontSize: 14,
      color: "#888",
      marginBottom: 10,
    },
    preco: {
      fontSize: 16,
      fontWeight: "600",
      color: "#D6005D",
      marginBottom: 10,
    },
    texto: {
      fontSize: 14,
      color: "#888",
      marginBottom: 5,
    },
    status: {
      fontWeight: "bold",
      color: "#D6005D",
    },
  });
  