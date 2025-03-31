import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage"; // Importando AsyncStorage
import BannerMinhasViagens from "@/components/Banner-MinhasViagens/BannerMinhasVIagens"; // Componente atualizado
import BannerMinhasViagensVoo from "@/components/Banner-MinhasViagens/BannerMinhasViagensVoo"; // Componente para voos
import { useNavigation } from "@react-navigation/native";
import verificarToken from "../verificarToken";

export default function MinhasViagens() {
  const navigation = useNavigation();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("agendado");
  const [hospedagens, setHospedagens] = useState([]);  // Inicializa como array vazio
  const [voos, setVoos] = useState([]);  // Novo estado para os voos
  const [isLoading, setIsLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);

  const opcaoPressionada = (opcao: string) => {
    setOpcaoSelecionada(opcao);
  };

  const fetchHospedagens = async () => {
    if (idUsuario) {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await fetch(
            `https://backend-viajados.vercel.app/api/reservas/hospedagens/${idUsuario}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          const data = await response.json();
          if (Array.isArray(data.data)) {
            setHospedagens(data.data);
          } else {
            console.error("Dados de hospedagem não são um array", data);
            setHospedagens([]);
          }
        } else {
          console.error("Token não encontrado no AsyncStorage");
        }
      } catch (error) {
        console.error("Erro ao buscar hospedagens:", error);
        setHospedagens([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchVoos = async () => {
    if (idUsuario) {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await fetch(
            `https://backend-viajados.vercel.app/api/reservas/voos/${idUsuario}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          const data = await response.json();
          if (Array.isArray(data.data)) {
            setVoos(data.data);
          } else {
            console.error("Dados de voos não são um array", data);
            setVoos([]);
          }
        } else {
          console.error("Token não encontrado no AsyncStorage");
        }
      } catch (error) {
        console.error("Erro ao buscar voos:", error);
        setVoos([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getIdUsuario = async () => {
    try {
      const id = await AsyncStorage.getItem("idUsuario");
      if (id !== null) {
        setIdUsuario(id);
      }
    } catch (error) {
      console.error("Erro ao ler idUsuario do AsyncStorage", error);
    }
  };

  useEffect(() => {
    verificarToken(navigation);
    getIdUsuario();
  }, [navigation]);

  useEffect(() => {
    if (idUsuario) {
      fetchHospedagens();
      fetchVoos();  // Chama a função para buscar os voos
    }
  }, [idUsuario]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.containerMinhasViagens}>
        <View style={styles.viewTitulo}>
          <Text style={styles.titulo}>Minhas Viagens</Text>
        </View>

        <View style={styles.filtroBusca}>
          <Pressable
            style={[
              styles.opcoesFiltro,
              opcaoSelecionada === "agendado" && styles.opcaoSelecionada,
            ]}
            onPress={() => opcaoPressionada("agendado")}
          >
            <Text
              style={[
                styles.textoFiltro,
                opcaoSelecionada === "agendado" && styles.textoFiltroSelecionado,
              ]}
            >
              Agendado
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.opcoesFiltro,
              opcaoSelecionada === "finalizado" && styles.opcaoSelecionada,
            ]}
            onPress={() => opcaoPressionada("finalizado")}
          >
            <Text
              style={[
                styles.textoFiltro,
                opcaoSelecionada === "finalizado" && styles.textoFiltroSelecionado,
              ]}
            >
              Finalizado
            </Text>
          </Pressable>
        </View>
      </View>

      {isLoading ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          {opcaoSelecionada === "agendado" &&
            hospedagens
              .filter((item) => item.status === "agendado")
              .map((item) => (
                <BannerMinhasViagens
                  key={item.idHospedagem}
                  hotelData={item}
                  onPress={() => console.log(`Detalhes do hotel: ${item.nome}`)}
                />
              ))}

          {/* Exibindo voos agendados */}
          {opcaoSelecionada === "agendado" &&
            voos
              .filter((item) => item.status === "agendado")
              .map((item) => (
                <BannerMinhasViagensVoo
                  key={item.idReserva}
                  vooData={item}
                  onPress={() => console.log(`Detalhes do voo: ${item.idReserva}`)}
                />
              ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDD5E9",
    padding: 20,
  },
  containerLogo: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginVertical: 15,
  },
  containerMinhasViagens: {
    marginVertical: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 20,
    marginTop: 10,
  },
  viewTitulo: {
    width: 200,
    height: 50,
    backgroundColor: "#D6005D",
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 20,
    marginLeft: -20,
  },
  filtroBusca: {
    flexDirection: "row",
    marginBottom: 20,
  },
  opcoesFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#FFC1D9",
  },
  opcaoSelecionada: {
    backgroundColor: "#D6005D",
  },
  textoFiltroSelecionado: {
    color: "#fff",
  },
  textoFiltro: {
    color: "#D6005D",
    fontWeight: "bold",
  },
});
