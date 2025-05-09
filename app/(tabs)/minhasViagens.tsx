import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import BannerMinhasViagens from "@/components/Banner-MinhasViagens/BannerMinhasVIagens";
import BannerMinhasViagensVoo from "@/components/Banner-MinhasViagens/BannerMinhasViagensVoo";
import verificarToken from "../verificarToken";

export default function MinhasViagens() {
  const navigation = useNavigation();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("agendado");
  const [tipoFiltro, setTipoFiltro] = useState("hoteis");
  const [hospedagens, setHospedagens] = useState([]);
  const [voos, setVoos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);

  const opcaoPressionada = (opcao) => {
    setOpcaoSelecionada(opcao);
  };

  const tipoPressionado = (tipo) => {
    setTipoFiltro(tipo);
  };

  useEffect(() => {
    verificarToken(navigation);
  }, [navigation]);

  const fetchHospedagens = async () => {
    setIsLoading(true);
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
    setIsLoading(true);
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

  const loadData = useCallback(() => {
    getIdUsuario();
    fetchHospedagens();
    fetchVoos();
  }, [idUsuario]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    if (idUsuario) {
      fetchHospedagens();
      fetchVoos();
    }
  }, [opcaoSelecionada, idUsuario]);

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

        <View style={[styles.filtroBusca, { marginTop: 10 }]}>
          <Pressable
            style={[
              styles.opcoesFiltro,
              tipoFiltro === "hoteis" && styles.opcaoSelecionada,
            ]}
            onPress={() => tipoPressionado("hoteis")}
          >
            <Text
              style={[
                styles.textoFiltro,
                tipoFiltro === "hoteis" && styles.textoFiltroSelecionado,
              ]}
            >
              Hotéis
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.opcoesFiltro,
              tipoFiltro === "voos" && styles.opcaoSelecionada,
            ]}
            onPress={() => tipoPressionado("voos")}
          >
            <Text
              style={[
                styles.textoFiltro,
                tipoFiltro === "voos" && styles.textoFiltroSelecionado,
              ]}
            >
              Voos
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.containerItens}>
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color="#D6005D" />
            <Text style={{ textAlign: "center" }}>Carregando...</Text>
          </>
        ) : (
          <>
            {opcaoSelecionada === "agendado" && tipoFiltro === "hoteis" && (
              hospedagens.filter((item) => item.status === "agendado").length > 0 ? (
                hospedagens
                  .filter((item) => item.status === "agendado")
                  .map((item) => (
                    <BannerMinhasViagens
                      key={item.idHospedagem}
                      hotelData={item}
                      onPress={() => console.log(`Detalhes do hotel: ${item.nome}`)}
                    />
                  ))
              ) : (
                <Text style={styles.semItensTexto}>Nenhum hotel favoritado</Text>
              )
            )}
            {opcaoSelecionada === "agendado" && tipoFiltro === "voos" && (
              voos.filter((item) => item.status === "agendado").length > 0 ? (
                voos
                  .filter((item) => item.status === "agendado")
                  .map((item) => (
                    <BannerMinhasViagensVoo
                      key={item.idReserva}
                      vooData={item}
                      onPress={() => console.log(`Detalhes do voo: ${item.idReserva}`)}
                    />
                  ))
              ) : (
                <Text style={styles.semItensTexto}>Nenhum voo favoritado</Text>
              )
            )}
            {opcaoSelecionada === "finalizado" && tipoFiltro === "hoteis" && (
              hospedagens.filter((item) => item.status === "finalizado").length > 0 ? (
                hospedagens
                  .filter((item) => item.status === "finalizado")
                  .map((item) => (
                    <BannerMinhasViagens
                      key={item.idHospedagem}
                      hotelData={item}
                      onPress={() => console.log(`Detalhes do hotel: ${item.nome}`)}
                    />
                  ))
              ) : (
                <Text style={styles.semItensTexto}>Nenhum hotel favoritado</Text>
              )
            )}
            {opcaoSelecionada === "finalizado" && tipoFiltro === "voos" && (
              voos.filter((item) => item.status === "finalizado").length > 0 ? (
                voos
                  .filter((item) => item.status === "finalizado")
                  .map((item) => (
                    <BannerMinhasViagensVoo
                      key={item.idReserva}
                      vooData={item}
                      onPress={() => console.log(`Detalhes do voo: ${item.idReserva}`)}
                    />
                  ))
              ) : (
                <Text style={styles.semItensTexto}>Nenhum voo favoritado</Text>
              )
            )}
          </>
        )}
      </View>
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
  containerItens: {
    marginBottom: 40,
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
  semItensTexto: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
});