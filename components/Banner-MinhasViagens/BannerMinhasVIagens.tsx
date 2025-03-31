import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

// Tipo dos dados que serão passados para o componente
  type HotelData = {
    idHospedagem: number;
    idHoteis: number;
    data_entrada: string;
    data_saida: string;
    status: string;
    nome: string;
    preco_diaria: string;
    descricao: string;
    avaliacao: number;
  };
  
  type Props = {
    hotelData: HotelData;
    onPress: () => void;
    isLoading?: boolean;
  };
  
  export default function BannerMinhasViagens({
    hotelData,
    onPress,
    isLoading = false,
  }: Props) {
    const { nome, avaliacao, descricao, preco_diaria } = hotelData;
  
    // Função para exibir as estrelas de avaliação
    const numeroEstrelas = (avaliacao: number) => {
      const estrelas = [];
      for (let i = 1; i <= 5; i++) {
        estrelas.push(
          <MaterialIcons
            key={i}
            name={i <= avaliacao ? "star" : "star-border"}
            size={24}
            color="#D6005D" // Ouro para as estrelas
          />
        );
      }
      return estrelas;
    };
  
    return (
      <Pressable onPress={onPress} style={styles.container}>
        <View style={styles.content}>
          {isLoading && <ActivityIndicator size="small" color="#D6005D" />}
  
          {/* Ícone de Hotel */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="hotel" size={30} color="#D6005D" />
          </View>
  
          {/* Nome do hotel */}
          <Text style={styles.nome}>{nome}</Text>
  
       
  
        
  
          {/* Preço */}
          <Text style={styles.preco}>R$ {preco_diaria}</Text>
  
          {/* Datas */}
          <View style={styles.dates}>
            <Text style={styles.texto}>
              Entrada: {new Date(hotelData.data_entrada).toLocaleDateString()}
            </Text>
            <Text style={styles.texto}>
              Saída: {new Date(hotelData.data_saida).toLocaleDateString()}
            </Text>
          </View>
  
          {/* Status */}
          <Text style={[styles.texto, styles.status]}>
            Status: {hotelData.status}
          </Text>
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
    },
    iconContainer: {
      marginBottom: 10,
    },
    nome: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 5,
    },
    avaliacao: {
      flexDirection: "row",
      marginBottom: 10,
    },
    descricao: {
      fontSize: 14,
      color: "#666",
      marginBottom: 10,
    },
    preco: {
      fontSize: 16,
      fontWeight: "600",
      color: "#D6005D",
      marginBottom: 10,
    },
    dates: {
      marginBottom: 15,
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
  