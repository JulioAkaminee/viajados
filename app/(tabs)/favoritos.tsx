import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import BannerHotelFavoritos from "@/components/Banner-Hotel/BannerHotelFavoritos";
import BannerVooFavoritos from "@/components/Banner-Voo/BannerVooFavoritos";
import ModalHotel from "@/components/Modal/ModalHotel";
import ModalVoo from "@/components/Modal/ModalVoo";
import verificarToken from "../verificarToken";

export default function Favoritos() {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("hoteis");
  const [modalHotelVisivel, setModalHotelVisivel] = useState(false);
  const [modalVooVisivel, setModalVooVisivel] = useState(false);
  const [hotelSelecionado, setHotelSelecionado] = useState(null);
  const [vooSelecionado, setVooSelecionado] = useState(null);
  const [hoteis, setHoteis] = useState([]);
  const [voos, setVoos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [notificacao, setNotificacao] = useState(null);
  const [desfavoritandoIds, setDesfavoritandoIds] = useState({});

  const navigation = useNavigation();

  useEffect(() => {
    verificarToken(navigation);
  }, [navigation]);

  const mostrarNotificacao = (mensagem) => {
    setNotificacao(mensagem);
    setTimeout(() => setNotificacao(null), 3000);
  };

  const carregarDados = async () => {
    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("idUsuario");

      if (!token || !usuarioId) {
        console.error("Token ou idUsuario não encontrado no AsyncStorage", {
          token,
          usuarioId,
        });
        return;
      }

      setIdUsuario(usuarioId);

      const respostaHoteis = await fetch(
        `https://backend-viajados.vercel.app/api/favoritos/hoteis?idUsuario=${usuarioId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (respostaHoteis.ok) {
        const dadosHoteis = await respostaHoteis.json();
        setHoteis(Array.isArray(dadosHoteis) ? dadosHoteis : []);
      } else if (respostaHoteis.status === 404) {
        setHoteis([]);
      } else {
        const textoHoteis = await respostaHoteis.text();
        throw new Error(
          `Erro na requisição de hotéis: ${respostaHoteis.status} - ${textoHoteis}`
        );
      }

      const respostaVoos = await fetch(
        `https://backend-viajados.vercel.app/api/favoritos/voos?idUsuario=${usuarioId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (respostaVoos.ok) {
        const dadosVoos = await respostaVoos.json();
        setVoos(Array.isArray(dadosVoos) ? dadosVoos : []);
      } else if (respostaVoos.status === 404) {
        setVoos([]);
      } else {
        const textoVoos = await respostaVoos.text();
        throw new Error(
          `Erro na requisição de voos: ${respostaVoos.status} - ${textoVoos}`
        );
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error.message || error);
      setHoteis([]);
      setVoos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorito = async (id, tipo) => {
    const chave = `${tipo}_${id}`;
    try {
      setDesfavoritandoIds(prev => ({ ...prev, [chave]: true }));

      const token = await AsyncStorage.getItem("token");
      if (!token || !idUsuario) {
        console.error("Token ou ID do usuário não encontrado");
        mostrarNotificacao("Erro: Faça login novamente");
        return;
      }

      const url = `https://backend-viajados.vercel.app/api/favoritos/${
        tipo === "hotel" ? "hoteis" : "voos"
      }`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUsuario,
          [tipo === "hotel" ? "idHoteis" : "idVoos"]: id,
        }),
      });

      if (response.ok) {
        if (tipo === "hotel") {
          setHoteis(prev => prev.filter(hotel => hotel.idHoteis !== id));
          mostrarNotificacao("Hotel foi removido dos favoritos!");
        } else {
          setVoos(prev => prev.filter(voo => voo.idVoos !== id));
          mostrarNotificacao("Voo foi removido dos favoritos!");
        }
      } else {
        let errorMessage = "Erro desconhecido";
        try {
          const errorText = await response.text();
          errorMessage = errorText || `Erro ${response.status}`;
        } catch (e) {
          errorMessage = `Erro ${response.status}`;
        }
        console.error("Erro ao remover favorito:", errorMessage);
        mostrarNotificacao("Erro ao remover favorito");
      }
    } catch (error) {
      console.error("Erro ao desfavoritar:", error);
      mostrarNotificacao("Erro ao remover favorito");
    } finally {
      setDesfavoritandoIds(prev => ({ ...prev, [chave]: false }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [opcaoSelecionada])
  );

  const opcaoPressionada = (opcao) => {
    setOpcaoSelecionada(opcao);
  };

  const bannerHotelPressionado = (hotel) => {
    setHotelSelecionado(hotel);
    setModalHotelVisivel(true);
  };

  const bannerVooPressionado = (voo) => {
    setVooSelecionado(voo);
    setModalVooVisivel(true);
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <>
      {notificacao && (
        <View style={styles.notificacaoContainer}>
          <Text style={styles.notificacaoTexto}>{notificacao}</Text>
        </View>
      )}

      <ModalHotel
        visible={modalHotelVisivel}
        hotel={hotelSelecionado}
        onClose={() => setModalHotelVisivel(false)}
      />

      <ModalVoo
        visible={modalVooVisivel}
        voo={vooSelecionado}
        onClose={() => setModalVooVisivel(false)}
        formatarData={formatarData}
      />

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FDD5E9"
        translucent={false}
      />
      <ScrollView style={styles.container}>
        <View style={styles.containerLogo}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.containerFavoritos}>
          <View style={styles.viewTitulo}>
            <Text style={styles.titulo}>Favoritos</Text>
          </View>
          <View style={styles.filtroBusca}>
            <Pressable
              style={[
                styles.opcoesFiltro,
                opcaoSelecionada === "hoteis" && styles.opcaoSelecionada,
              ]}
              onPress={() => opcaoPressionada("hoteis")}
            >
              <Text
                style={[
                  styles.textoFiltro,
                  opcaoSelecionada === "hoteis" && styles.textoFiltroSelecionado,
                ]}
              >
                Hotéis
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.opcoesFiltro,
                opcaoSelecionada === "voos" && styles.opcaoSelecionada,
              ]}
              onPress={() => opcaoPressionada("voos")}
            >
              <Text
                style={[
                  styles.textoFiltro,
                  opcaoSelecionada === "voos" && styles.textoFiltroSelecionado,
                ]}
              >
                Voos
              </Text>
            </Pressable>
          </View>
          <ScrollView style={styles.carrossel}>
            {opcaoSelecionada === "hoteis" && (
              <ScrollView>
                {isLoading ? (
                  <View style={styles.containerMensagem}>
                    <ActivityIndicator size="large" color="#D6005D" />
                    <Text style={styles.mensagem}>Carregando hotéis...</Text>
                  </View>
                ) : hoteis.length > 0 ? (
                  hoteis.map((hotel, index) => (
                    <BannerHotelFavoritos
                      key={index}
                      imagem={
                        hotel.imagens &&
                        Array.isArray(hotel.imagens) &&
                        hotel.imagens[0]
                          ? { uri: hotel.imagens[0] }
                          : require("../../assets/images/defaultImage.jpg")
                      }
                      nome={hotel.nome || "Hotel sem nome"}
                      descricao={hotel.descricao || "Sem descrição"}
                      avaliacao={hotel.avaliacao || 0}
                      preco={hotel.preco_diaria || "Preço não disponível"}
                      onPress={() => bannerHotelPressionado(hotel)}
                      onDesfavoritar={() => toggleFavorito(hotel.idHoteis, "hotel")}
                      isLoading={desfavoritandoIds[`hotel_${hotel.idHoteis}`]}
                    />
                  ))
                ) : (
                  <Text style={styles.mensagem}>Nenhum hotel favoritado</Text>
                )}
              </ScrollView>
            )}
            {opcaoSelecionada === "voos" && (
              <ScrollView>
                {isLoading ? (
                  <View style={styles.containerMensagem}>
                    <ActivityIndicator size="large" color="#D6005D" />
                    <Text style={styles.mensagem}>Carregando voos...</Text>
                  </View>
                ) : voos.length > 0 ? (
                  voos.map((voo, index) => (
                    <BannerVooFavoritos
                      key={index}
                      imagem={
                        voo.imagens &&
                        Array.isArray(voo.imagens) &&
                        voo.imagens[0]
                          ? { uri: voo.imagens[0] }
                          : require("../../assets/images/defaultImage.jpg")
                      }
                      destino={voo.destino || "Destino não informado"}
                      origem={voo.origem || "Origem não informada"}
                      data={formatarData(voo.data) || "Data não informada"}
                      preco={voo.preco || "Preço não disponível"}
                      onPress={() => bannerVooPressionado(voo)}
                      onDesfavoritar={() => toggleFavorito(voo.idVoos, "voo")}
                      isLoading={desfavoritandoIds[`voo_${voo.idVoos}`]}
                    />
                  ))
                ) : (
                  <Text style={styles.mensagem}>Nenhum voo favoritado</Text>
                )}
              </ScrollView>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  notificacaoContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  notificacaoTexto: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
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
  containerFavoritos: {
    marginVertical: 20,
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
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 20,
    marginTop: 10,
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
  textoFiltro: {
    color: "#D6005D",
    fontWeight: "bold",
  },
  textoFiltroSelecionado: {
    color: "#fff",
  },
  carrossel: {
    marginBottom: 13,
  },
  containerMensagem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  mensagem: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
});