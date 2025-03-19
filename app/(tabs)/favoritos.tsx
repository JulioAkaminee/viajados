import React, { useState } from "react";
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

import BannerHotelFavoritos from "@/components/Banner-Hotel/BannerHotelFavoritos";
import BannerVooFavoritos from "@/components/Banner-Voo/BannerVooFavoritos";

export default function Favoritos() {
  const [modalHotelVisivel, setModalHotelVisivel] = useState(false);
  const [modalVooVisivel, setModalVooVisivel] = useState(false);
  const [hotelSelecionado, setHotelSelecionado] = useState(null);
  const [vooSelecionado, setVooSelecionado] = useState(null);

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
                {hotelSelecionado.imagens.map(
                  (
                    image: ImageSourcePropType | undefined,
                    index: React.Key | null | undefined
                  ) => (
                    <Image
                      key={index}
                      source={image}
                      style={styles.imagemModal}
                    />
                  )
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
                {vooSelecionado.imagens.map(
                  (
                    image: ImageSourcePropType | undefined,
                    index: React.Key | null | undefined
                  ) => (
                    <Image
                      key={index}
                      source={image}
                      style={styles.imagemModal}
                    />
                  )
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

      <ScrollView>
        <Text>Favoritos</Text>

        <BannerHotelFavoritos
          imagem={require("../../assets/images/hoteis/hotel-paraiso.jpg")}
          nome="Hotel Paraíso"
          avaliacao={4}
          inicio="10 de Abril"
          fim="15 de Abril"
          descricao="Hotel de luxo com vista para o mar"
          preco="R$ 250,00"
          onPress={() =>
            bannerHotelPressionado({
              nome: "Hotel Paraíso",
              avaliacao: 4,
              imagens: [
                require("../../assets/images/hoteis/hotel-paraiso.jpg"),
                require("../../assets/images/hoteis/hotel-paraiso-2.jpg"),
                require("../../assets/images/hoteis/hotel-paraiso-3.jpg"),
              ],
              descricao: "Hotel de luxo com vista para o mar",
              localizacao: "Praia de Copacabana, Rio de Janeiro/RJ",
              inicio: "10 de Abril",
              fim: "15 de Abril",
              preco: "R$ 250,00",
            })
          }
        />
        <BannerVooFavoritos
          imagem={require("../../assets/images/voos/sp.jpg")}
          destino="São Paulo"
          origem="Rio de Janeiro"
          saida="08:00"
          data="01 de Abril"
          preco="R$ 300,00"
          onPress={() =>
            bannerVooPressionado({
              imagens: [
                require("../../assets/images/voos/sp.jpg"),
                require("../../assets/images/voos/sp-2.jpg"),
                require("../../assets/images/voos/sp-3.jpg"),
              ],
              destino: "São Paulo",
              origem: "Rio de Janeiro",
              descricao: "Conheça a maior cidade do país",
              saida: "08:00",
              data: "01 de Abril",
              preco: "R$ 300,00",
            })
          }
        />
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
});
