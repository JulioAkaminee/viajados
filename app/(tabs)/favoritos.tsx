import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BannerHotelFavoritos from "@/components/Banner-Hotel/BannerHotelFavoritos";
import BannerVooFavoritos from "@/components/Banner-Voo/BannerVooFavoritos";

export default function Favoritos() {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("hoteis");
  const [modalHotelVisivel, setModalHotelVisivel] = useState(false);
  const [modalVooVisivel, setModalVooVisivel] = useState(false);
  const [hotelSelecionado, setHotelSelecionado] = useState(null);
  const [vooSelecionado, setVooSelecionado] = useState(null);
  const [hoteis, setHoteis] = useState([]);
  const [voos, setVoos] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Busca o token e o idUsuario
        const token = await AsyncStorage.getItem("token");
        const idUsuario = await AsyncStorage.getItem("idUsuario");

        if (!token || !idUsuario) {
          console.error("Token ou idUsuario não encontrado no AsyncStorage");
          return;
        }

        // Busca hotéis favoritados
        const respostaHoteis = await fetch(
          `https://backend-viajados.vercel.app/api/favoritos/hoteis?idUsuario=${idUsuario}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!respostaHoteis.ok) {
          throw new Error(`Erro na requisição de hotéis: ${respostaHoteis.status}`);
        }

        const dadosHoteis = await respostaHoteis.json();
        setHoteis(Array.isArray(dadosHoteis) ? dadosHoteis : dadosHoteis.data || []);

        // Busca voos favoritados
        const respostaVoos = await fetch(
          `https://backend-viajados.vercel.app/api/favoritos/voos?IdUsuario=${idUsuario}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Hoteis carregados:", hoteis);
        if (!respostaVoos.ok) {
          throw new Error(`Erro na requisição de voos: ${respostaVoos.status}`);
        }

        const dadosVoos = await respostaVoos.json();
        setVoos(Array.isArray(dadosVoos) ? dadosVoos : dadosVoos.data || []);

      } catch (error) {
        console.error("Erro ao carregar dados:", error.message || error);
      }
    };

    carregarDados();
  }, []);

  const opcaoPressionada = (opcao: React.SetStateAction<string>) => {
    setOpcaoSelecionada(opcao);
  };

  const bannerHotelPressionado = (hotel: React.SetStateAction<null>) => {
    setHotelSelecionado(hotel);
    setModalHotelVisivel(true);
  };

  const bannerVooPressionado = (voo: React.SetStateAction<null>) => {
    setVooSelecionado(voo);
    setModalVooVisivel(true);
  };

  return (
    <>
      {modalHotelVisivel && hotelSelecionado && (
        <View style={styles.containerModal}>
          <ScrollView style={styles.conteudoModal}>
            <Text style={styles.tituloModal}>{hotelSelecionado.nome}</Text>
            <View style={styles.containerCarrossel}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.rolarImagens}
              >
                {hotelSelecionado.imagens && Array.isArray(hotelSelecionado.imagens) ? (
                  hotelSelecionado.imagens.map(
                    (
                      image: ImageSourcePropType | undefined,
                      index: React.Key | null | undefined
                    ) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.imagemModal}
                        onError={(e) => console.log(`Erro ao carregar imagem: ${image}`, e.nativeEvent.error)}
                      />
                    )
                  )
                ) : (
                  <Text>Imagens não disponíveis</Text>
                )}
              </ScrollView>
            </View>

            <View style={styles.containerInformacoes}>
              <Text style={styles.textoInformacoes}>
                <Text style={{ fontWeight: "bold" }}>Localização:</Text>{" "}
                {hotelSelecionado.localizacao}
              </Text>
              <Text style={styles.textoInformacoes}>
                <Text style={{ fontWeight: "bold" }}>Início:</Text>{" "}
                {hotelSelecionado.inicio}
              </Text>
              <Text style={styles.textoInformacoes}>
                <Text style={{ fontWeight: "bold" }}>Fim:</Text>{" "}
                {hotelSelecionado.fim}
              </Text>
              <Text style={styles.textoInformacoes}>
                <Text style={{ fontWeight: "bold" }}>Preço:</Text>{" "}
                {hotelSelecionado.preco}
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
            <View style={styles.containerCarrossel}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.rolarImagens}
              >
                {vooSelecionado.imagens && Array.isArray(vooSelecionado.imagens) ? (
                  vooSelecionado.imagens.map(
                    (
                      image: ImageSourcePropType | undefined,
                      index: React.Key | null | undefined
                    ) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.imagemModal}
                        onError={(e) => console.log(`Erro ao carregar imagem: ${image}`, e.nativeEvent.error)}
                      />
                    )
                  )
                ) : (
                  <Text>Imagens não disponíveis</Text>
                )}
              </ScrollView>
            </View>
            <Text style={styles.tituloModal}>{vooSelecionado.destino}</Text>
            <View style={styles.containerInformacoes}>
              <Text style={styles.descricao}>{vooSelecionado.descricao}</Text>
              <Text style={styles.textoInformacoes}>
                Origem: {vooSelecionado.origem}
              </Text>
              <Text style={styles.textoInformacoes}>
                Saída: {vooSelecionado.saida}
              </Text>
              <Text style={styles.textoInformacoes}>
                Data: {vooSelecionado.data}
              </Text>
              <Text style={styles.textoInformacoes}>
                Preço: {vooSelecionado.preco}
              </Text>
            </View>
            <View style={styles.containerOferecimentos}>
              <Text style={styles.tituloOferecimentos}>
                O que o voo oferece:
              </Text>
              <View style={styles.containerConteudoOferecimentos}>
                <MaterialIcons name="airplane-ticket" size={30} color="#D6005D" />
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
              <>
                <ScrollView style={styles.containerFavoritosLista}>
                  {hoteis.length > 0 ? (
                    hoteis.map((hotel, index) => (
                      <BannerHotelFavoritos
                        key={index}
                        imagem={
                          hotel.imagens && Array.isArray(hotel.imagens) && hotel.imagens[0]
                            ? { uri: hotel.imagens[0] }
                            : require("../../assets/images/hoteis/defaultHotel.jpg")
                        }
                        nome={hotel.nome || "Hotel sem nome"}
                        avaliacao={hotel.avaliacao}
                        inicio={hotel.inicio}
                        fim={hotel.fim}
                        descricao={hotel.descricao || "Sem descrição"}
                        preco={hotel.preco || "Preço não disponível"}
                        onPress={() => bannerHotelPressionado(hotel)}
                      />
                    ))
                  ) : (
                    <Text>Nenhum hotel favoritado</Text>
                  )}
                </ScrollView>
              </>
            )}
            {opcaoSelecionada === "voos" && (
              <>
                <ScrollView style={styles.containerFavoritosLista}>
                  {voos.length > 0 ? (
                    voos.map((voo, index) => (
                      <BannerVooFavoritos
                        key={index}
                        imagem={
                          voo.imagens && Array.isArray(voo.imagens) && voo.imagens[0]
                            ? { uri: voo.imagens[0] }
                            : require("../../assets/images/hoteis/defaultHotel.jpg")
                        }
                        destino={voo.destino || "Destino não informado"}
                        origem={voo.origem || "Origem não informada"}
                        descricao={voo.descricao || "Sem descrição"}
                        saida={voo.saida || "Horário não informado"}
                        data={voo.data || "Data não informada"}
                        preco={voo.preco || "Preço não disponível"}
                        onPress={() => bannerVooPressionado(voo)}
                      />
                    ))
                  ) : (
                    <Text>Nenhum voo favoritado</Text>
                  )}
                </ScrollView>
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
  rolarImagens: {
    flexDirection: "row",
  },
  imagemModal: {
    width: 250,
    height: 150,
    marginRight: 10,
  },
  containerInformacoes: {
    alignItems: "flex-start",
  },
  descricao: {
    fontSize: 18,
    marginBottom: 5,
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
    marginBottom: 40,
    padding: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
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
    marginVertical: 15,
  },
  texto: {
    fontSize: 14,
  },
  containerFavoritos: {
    marginVertical: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
    marginLeft: 20,
    marginTop: 8,
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
  carrossel: {
    marginBottom: 13,
  },
  containerFavoritosLista: {},
});