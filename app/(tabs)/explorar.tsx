import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import BannerHotel from "@/components/Banner-Hotel/BannerHotel";
import BannerVoo from "@/components/Banner-Voo/BannerVoo";

export default function Explorar() {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("hoteis");
  const [modalHotelVisivel, setModalHotelVisivel] = useState(false);
  const [modalVooVisivel, setModalVooVisivel] = useState(false);
  const [hotelSelecionado, setHotelSelecionado] = useState(null);
  const [vooSelecionado, setVooSelecionado] = useState(null);
  const [hoteis, setHoteis] = useState([]);
  const [voos, setVoos] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [idUsuario, setIdUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  // Função para carregar favoritos do usuário
  const carregarFavoritos = async (token, usuarioId) => {
    try {
      const novosFavoritos = {};

      // Carregar favoritos de hotéis
      const respostaHoteis = await fetch(
        `https://backend-viajados.vercel.app/api/favoritos/hoteis?idUsuario=${usuarioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (respostaHoteis.ok) {
        const hoteisFavoritos = await respostaHoteis.json();
        if (Array.isArray(hoteisFavoritos)) {
          hoteisFavoritos.forEach((hotel) => {
            novosFavoritos[`hotel_${hotel.idHoteis}`] = true;
          });
        }
      } else if (respostaHoteis.status === 404) {
        // Se não há hotéis favoritados, apenas continua sem adicionar ao objeto
        console.log("Nenhum hotel favoritado encontrado");
      } else {
        throw new Error(
          `Erro na requisição de hotéis: ${respostaHoteis.status}`
        );
      }

      // Carregar favoritos de voos
      const respostaVoos = await fetch(
        `https://backend-viajados.vercel.app/api/favoritos/voos?idUsuario=${usuarioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (respostaVoos.ok) {
        const voosFavoritos = await respostaVoos.json();
        if (Array.isArray(voosFavoritos)) {
          voosFavoritos.forEach((voo) => {
            novosFavoritos[`voo_${voo.idVoos}`] = true;
          });
        }
      } else if (respostaVoos.status === 404) {
        // Se não há voos favoritados, apenas continua sem adicionar ao objeto
        console.log("Nenhum voo favoritado encontrado");
      } else {
        throw new Error(`Erro na requisição de voos: ${respostaVoos.status}`);
      }

      setFavoritos(novosFavoritos);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error.message || error);
    }
  };

  // Função para favoritar/desfavoritar
  const toggleFavorito = async (id, tipo) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const chaveFavorito = `${tipo}_${id}`;
      const estaFavoritado = favoritos[chaveFavorito];
      const url = `https://backend-viajados.vercel.app/api/favoritos/${
        tipo === "hotel" ? "hoteis" : "voos"
      }`;

      const response = await fetch(url, {
        method: estaFavoritado ? "DELETE" : "POST",
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
        setFavoritos((prev) => {
          const novosFavoritos = { ...prev };
          if (estaFavoritado) {
            delete novosFavoritos[chaveFavorito]; // Remove a chave se desfavoritado
          } else {
            novosFavoritos[chaveFavorito] = true; // Adiciona a chave se favoritado
          }
          return novosFavoritos;
        });
        // Recarrega os favoritos para garantir sincronia com o backend
        await carregarFavoritos(token, idUsuario);
      } else {
        const errorText = await response.text();
        console.error("Erro ao atualizar favorito:", errorText);
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    }
  };

  const carregarDados = async () => {
    setIsLoading(true);

    try {
      const nome = await AsyncStorage.getItem("nome");
      const usuarioId = await AsyncStorage.getItem("idUsuario");
      const token = await AsyncStorage.getItem("token");

      if (nome) setNomeUsuario(nome);
      if (usuarioId) setIdUsuario(usuarioId);

      if (!token || !usuarioId) {
        console.error("Token ou ID do usuário não encontrado");
        return;
      }

      await carregarFavoritos(token, usuarioId);

      const respostaHoteis = await fetch(
        "https://backend-viajados.vercel.app/api/hoteis",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!respostaHoteis.ok) {
        throw new Error(`Erro ao buscar hotéis: ${respostaHoteis.status}`);
      }
      const dadosHoteis = await respostaHoteis.json();
      setHoteis(
        Array.isArray(dadosHoteis) ? dadosHoteis : dadosHoteis.data || []
      );

      const respostaVoos = await fetch(
        "https://backend-viajados.vercel.app/api/voos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!respostaVoos.ok) {
        throw new Error(`Erro ao buscar voos: ${respostaVoos.status}`);
      }
      const dadosVoos = await respostaVoos.json();
      setVoos(Array.isArray(dadosVoos) ? dadosVoos : dadosVoos.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      carregarDados(); // Chama a função de fetch quando a aba ganha foco
    }, [opcaoSelecionada]) // Array de dependências vazio para evitar chamadas desnecessárias
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
      {modalHotelVisivel && hotelSelecionado && (
        <View style={styles.containerModal}>
          <ScrollView style={styles.conteudoModal}>
            <Text style={styles.tituloModal}>{hotelSelecionado.nome}</Text>
            <View style={styles.containerCarrossel}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {hotelSelecionado.imagens &&
                Array.isArray(hotelSelecionado.imagens) ? (
                  hotelSelecionado.imagens.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.imagemModal}
                      onError={(e) =>
                        console.log(
                          `Erro ao carregar imagem: ${image}`,
                          e.nativeEvent.error
                        )
                      }
                    />
                  ))
                ) : (
                  <Text>Imagens não disponíveis</Text>
                )}
              </ScrollView>
            </View>
            <View style={styles.containerInformacoes}>
              <Text style={styles.textoInformacoes}>
                <Text style={{ fontWeight: "bold" }}>Preço:</Text> R${" "}
                {hotelSelecionado.preco_diaria}
              </Text>
              <Text style={styles.textoInformacoes}>
                <Text style={{ fontWeight: "bold" }}>Descrição:</Text>{" "}
                {hotelSelecionado.descricao}
              </Text>
            </View>
            <View style={styles.containerAvaliacao}>
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialIcons
                  key={i}
                  name={i < hotelSelecionado.avaliacao ? "star" : "star-border"}
                  size={24}
                  color="#000"
                  style={styles.estrela}
                />
              ))}
            </View>
            <View style={styles.containerOferecimentos}>
              <Text style={styles.tituloOferecimentos}>
                O que a hospedagem oferece:
              </Text>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons name="ac-unit" size={30} color="#D6005D" />
                <Text style={styles.textoOferecimentos}>Ar-condicionado</Text>
              </View>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons name="pool" size={30} color="#D6005D" />
                <Text style={styles.textoOferecimentos}>Piscina</Text>
              </View>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons name="tv" size={30} color="#D6005D" />
                <Text style={styles.textoOferecimentos}>TV a cabo</Text>
              </View>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons name="wifi" size={30} color="#D6005D" />
                <Text style={styles.textoOferecimentos}>Wifi</Text>
              </View>
            </View>
            <Pressable onPress={() => {}} style={styles.botaoEscolher}>
              <Text style={styles.textoBotaoEscolher}>Escolher</Text>
            </Pressable>
            <Pressable
              onPress={() => setModalHotelVisivel(false)}
              style={styles.botaoFechar}
            >
              <Text style={styles.textoBotaoFechar}>Fechar</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}

      {modalVooVisivel && vooSelecionado && (
        <View style={styles.containerModal}>
          <ScrollView style={styles.conteudoModal}>
            <Text style={styles.tituloModal}>
              {vooSelecionado.destino || "Destino não informado"}
            </Text>
            <View style={styles.containerCarrossel}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {vooSelecionado.imagens &&
                Array.isArray(vooSelecionado.imagens) ? (
                  vooSelecionado.imagens.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.imagemModal}
                      onError={(e) =>
                        console.log(
                          `Erro ao carregar imagem: ${image}`,
                          e.nativeEvent.error
                        )
                      }
                    />
                  ))
                ) : (
                  <Text>Imagens não disponíveis</Text>
                )}
              </ScrollView>
            </View>
            <Text style={styles.textoInformacoes}>
              <Text style={{ fontWeight: "bold" }}>Origem:</Text>{" "}
              {vooSelecionado.origem}
            </Text>
            <Text style={styles.textoInformacoes}>
              <Text style={{ fontWeight: "bold" }}>Preço:</Text> R${" "}
              {vooSelecionado.preco}
            </Text>
            <Text style={styles.textoInformacoes}>
              <Text style={{ fontWeight: "bold" }}>Data:</Text>{" "}
              {formatarData(vooSelecionado.data)}
            </Text>
            <View style={styles.containerOferecimentos}>
              <Text style={styles.tituloOferecimentos}>
                O que o voo oferece:
              </Text>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons
                  name="airplane-ticket"
                  size={30}
                  color="#D6005D"
                />
                <Text style={styles.textoOferecimentos}>Classe Econômica</Text>
              </View>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons name="ac-unit" size={30} color="#D6005D" />
                <Text style={styles.textoOferecimentos}>Ar-condicionado</Text>
              </View>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons name="tv" size={30} color="#D6005D" />
                <Text style={styles.textoOferecimentos}>TV a cabo</Text>
              </View>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons name="wifi" size={30} color="#D6005D" />
                <Text style={styles.textoOferecimentos}>Wifi</Text>
              </View>
            </View>
            <Pressable onPress={() => {}} style={styles.botaoEscolher}>
              <Text style={styles.textoBotaoEscolher}>Escolher</Text>
            </Pressable>
            <Pressable
              onPress={() => setModalVooVisivel(false)}
              style={styles.botaoFechar}
            >
              <Text style={styles.textoBotaoFechar}>Fechar</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}

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

        <View style={styles.containerInfoUsuario}>
          <Image
            source={require("../../assets/images/user-icon.png")}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.saudacao}>Olá, {nomeUsuario || "Usuário"}</Text>
            <Text style={styles.texto}>Bem-vindo de volta!</Text>
          </View>
        </View>

        <View style={styles.containerExplorar}>
          <Text style={styles.titulo}>Explorar</Text>
          <Text style={styles.subTitulo}>Descubra novos lugares</Text>
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
                  opcaoSelecionada === "hoteis" &&
                    styles.textoFiltroSelecionado,
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carrossel}
            >
              {opcaoSelecionada === "hoteis" && (
                <>
                  {isLoading ? (
                    <View>
                      <ActivityIndicator size="large" color="#D6005D" />
                      <Text style={styles.mensagem}>Carregando hotéis...</Text>
                    </View>
                  ) : hoteis.length > 0 ? (
                    hoteis.map((hotel, index) => (
                      <BannerHotel
                        key={`hotel_${hotel.idHoteis}_${index}`}
                        imagem={
                          hotel.imagens && hotel.imagens[0]
                            ? { uri: hotel.imagens[0] }
                            : require("../../assets/images/hoteis/defaultHotel.jpg")
                        }
                        nome={hotel.nome || "Hotel sem nome"}
                        descricao={hotel.descricao || "Sem descrição"}
                        avaliacao={hotel.avaliacao || 0}
                        preco={hotel.preco_diaria || "Preço não disponível"}
                        onPress={() => bannerHotelPressionado(hotel)}
                        favorito={favoritos[`hotel_${hotel.idHoteis}`] || false}
                        onFavoritar={() =>
                          toggleFavorito(hotel.idHoteis, "hotel")
                        }
                      />
                    ))
                  ) : (
                    <Text>Nenhum hotel disponível</Text>
                  )}
                </>
              )}

            {opcaoSelecionada === "voos" && (
              <>
                {isLoading ? (
                  <View>
                    <ActivityIndicator size="large" color="#D6005D" />
                    <Text style={styles.mensagem}>Carregando voos...</Text>
                  </View>
                ) : voos.length > 0 ? (
                  voos.map((voo, index) => (
                    <BannerVoo
                      key={`voo_${voo.idVoos}_${index}`}
                      imagem={
                        voo.imagens && voo.imagens[0]
                          ? { uri: voo.imagens[0] }
                          : require("../../assets/images/hoteis/defaultHotel.jpg")
                      }
                      destino={voo.destino || "Destino não informado"}
                      origem={voo.origem || "Origem não informada"}
                      descricao={voo.descricao || "Sem descrição"}
                      saida={voo.saida || "Horário não informado"}
                      data={formatarData(voo.data) || "Data não informada"}
                      preco={voo.preco || "Preço não disponível"}
                      onPress={() => bannerVooPressionado(voo)}
                      favorito={favoritos[`voo_${voo.idVoos}`] || false}
                      onFavoritar={() => toggleFavorito(voo.idVoos, "voo")}
                    />
                  ))
                ) : (
                  <Text>Nenhum voo disponível</Text>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  containerModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
  conteudoModal: {
    maxWidth: "90%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  tituloModal: {
    fontSize: 20,
    marginBottom: 2,
    fontWeight: "bold",
  },
  containerAvaliacao: {
    flexDirection: "row",
    marginBottom: 10,
  },
  estrela: {
    fontSize: 20,
    marginRight: 3,
  },
  containerCarrossel: {
    flexDirection: "row",
    marginBottom: 5,
  },
  imagemModal: {
    width: 250,
    height: 150,
    marginRight: 10,
  },
  containerInformacoes: {
    alignItems: "flex-start",
  },
  textoInformacoes: {
    fontSize: 16,
    marginBottom: 5,
  },
  containerOferecimentos: {
    display: "flex",
  },
  tituloOferecimentos: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerConteudoOferecimentos: {
    flexDirection: "row",
    alignItems: "center",
  },
  textoOferecimentos: {
    fontSize: 16,
    marginLeft: 10,
    color: "#555",
  },
  botaoEscolher: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#D6005D",
    borderRadius: 5,
  },
  textoBotaoEscolher: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoFechar: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
    marginBottom: 30,
  },
  textoBotaoFechar: {
    color: "#000",
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
    marginTop: 15,
  },
  containerInfoUsuario: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  saudacao: {
    fontSize: 18,
    fontWeight: "bold",
  },
  texto: {
    fontSize: 14,
  },
  containerExplorar: {
    marginVertical: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subTitulo: {
    fontSize: 16,
    marginBottom: 15,
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
  carrossel: {
    flexDirection: "row",
    marginBottom: 13,
   
  },
  mensagem: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
});
