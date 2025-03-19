import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BannerHotelFavoritos from "@/components/Banner-Hotel/BannerHotelFavoritos";
import BannerVooFavoritos from "@/components/Banner-Voo/BannerVooFavoritos";
import { useState } from "react";

export default function Favoritos() {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("hoteis");
  const [modalHotelVisivel, setModalHotelVisivel] = useState(false);
  const [modalVooVisivel, setModalVooVisivel] = useState(false);
  const [hotelSelecionado, setHotelSelecionado] = useState(null);
  const [vooSelecionado, setVooSelecionado] = useState(null);

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
            <Text style={styles.saudacao}>Olá, Nome</Text>
            <Text style={styles.texto}>Bem-vindo de volta!</Text>
          </View>
        </View>
        <View style={styles.containerExplorar}>
          <Text style={styles.titulo}>Favoritos</Text>
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
                <BannerHotelFavoritos
                  imagem={require("../../assets/images/hoteis/hotel-paraiso.jpg")}
                  nome="Hotel Paraíso"
                  avaliacao={4}
                  inicio="10 de Abril"
                  fim="15 de Abril"
                  descricao="Hotel de luxo com vista para o mar"
                  preco="R$ 250,00"
                  onPress={() => console.log("Hotel selecionado!")}
                />
              </>
            )}
            {opcaoSelecionada === "voos" && (
              <>
                <BannerVooFavoritos
                  imagem={require("../../assets/images/voos/sp.jpg")}
                  destino="São Paulo"
                  origem="Rio de Janeiro"
                  descricao="Conheça a maior cidade do país"
                  saida="08:00"
                  data="01 de Abril"
                  preco="R$ 300,00"
                  onPress={() => console.log("Voo selecionado!")}
                />
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
    marginBottom: 10,
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
});
