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
            
          
            style={styles.carrossel}
          >
            {opcaoSelecionada === "hoteis" && (
              <>
                <ScrollView style={styles.containerFavoritosLista}>
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
                  <BannerHotelFavoritos
                    imagem={require("../../assets/images/hoteis/maceio.jpg")}
                    nome="Hotel Porto"
                    avaliacao={4}
                    inicio="12 de Dezembro"
                    fim="20 de Dezembro"
                    descricao="Hotel de luxo com praia privativa"
                    preco="R$ 250,00"
                    onPress={() =>
                      bannerHotelPressionado({
                        nome: "Hotel Porto de Naus",
                        avaliacao: 4,
                        imagens: [
                          require("../../assets/images/hoteis/maceio.jpg"),
                          require("../../assets/images/hoteis/maceio2.jpg"),
                          require("../../assets/images/hoteis/maceio3.jpg"),
                        ],
                        descricao: "Hotel de luxo com praia privativa",
                        localizacao: "Praia de Maceio, Maceio/AL",
                        inicio: "12 de Dezembro",
                        fim: "20 de Dezembro",
                        preco: "R$ 450,00",
                      })
                    }
                  />
                  <BannerHotelFavoritos
                    imagem={require("../../assets/images/hoteis/fortaleza.jpg")}
                    nome="Hotel Fortaleza"
                    avaliacao={4}
                    inicio="14 de Novembro"
                    fim="18 de Novembro"
                    descricao="Hotel com café da manhã incluso"
                    preco="R$ 310,00"
                    onPress={() =>
                      bannerHotelPressionado({
                        nome: "Hotel Fortaleza Beach",
                        avaliacao: 4,
                        imagens: [
                          require("../../assets/images/hoteis/fortaleza.jpg"),
                          require("../../assets/images/hoteis/fortaleza2.jpg"),
                          require("../../assets/images/hoteis/fortaleza3.jpg"),
                        ],
                        descricao:
                          "Hotel de Hotel com café da manhã incluso, acadêmia e espaço kids.",
                        localizacao: "Praia das Ondas, Fortaleza/CE",
                        inicio: "14 de Novembro",
                        fim: "15 de Abril",
                        preco: "18 de Novembro",
                      })
                    }
                  />
                  <BannerHotelFavoritos
                    imagem={require("../../assets/images/hoteis/porto-seguro.jpg")}
                    nome="Hotel Romania"
                    avaliacao={4}
                    inicio="2 de Fevereiro"
                    fim="9 de Fevereiro"
                    descricao="Hotel mais exclusivo de Porto Seguro"
                    preco="R$ 700,00"
                    onPress={() =>
                      bannerHotelPressionado({
                        nome: "Hotel Romania",
                        avaliacao: 5,
                        imagens: [
                          require("../../assets/images/hoteis/porto-seguro.jpg"),
                          require("../../assets/images/hoteis/porto-seguro2.jpg"),
                          require("../../assets/images/hoteis/porto-seguro.jpg"),
                        ],
                        descricao: "Hotel mais exclusivo de Porto Seguro",
                        localizacao: "Praia do Tombo, Porto-Seguro/BA ",
                        inicio: "2 de Fevereiro",
                        fim: "9 de Fevereiro",
                        preco: "R$ 700,00",
                      })
                    }
                  />
                </ScrollView>
              </>
            )}
            {opcaoSelecionada === "voos" && (
              <>
                <ScrollView containerFavoritosLista>
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
                  <BannerVooFavoritos
                    imagem={require("../../assets/images/voos/fortaleza-2.jpg")}
                    destino="Fortaleza"
                    origem="São Paulo"
                    saida="11:00"
                    data="25 de Agosto"
                    preco="R$ 500,00"
                    onPress={() =>
                      bannerVooPressionado({
                        imagens: [
                          require("../../assets/images/voos/fortaleza-2.jpg"),
                          require("../../assets/images/voos/fortaleza.jpg"),
                          require("../../assets/images/voos/fortaleza-3.jpg"),
                        ],
                        destino: "Fortaleza",
                        origem: "São Paulo",
                        descricao: "Conheça umas das melhores cidades turísticas",
                        saida: "11:00",
                        data: "25 de Agosto",
                        preco: "R$ 500,00",
                      })
                    }
                  />
                  <BannerVooFavoritos
                    imagem={require("../../assets/images/voos/curitiba.jpg")}
                    destino="Curitiba"
                    origem="Minas Gerais"
                    saida="23:00"
                    data="30 de Novembro"
                    preco="R$ 450,00"
                    onPress={() =>
                      bannerVooPressionado({
                        imagens: [
                          require("../../assets/images/voos/curitiba.jpg"),
                          require("../../assets/images/voos/curitiba-2.jpg"),
                          require("../../assets/images/voos/curitiba-3.jpg"),
                        ],
                        destino: "Curitiba",
                        origem: "Minas Gerais",
                        descricao: "Europa brasileira",
                        saida: "15:00",
                        data: "04 de Janeiro",
                        preco: "R$ 450,00",
                      })
                    }
                  />
                  <BannerVooFavoritos
                    imagem={require("../../assets/images/voos/maceio.jpg")}
                    destino="Maceio"
                    origem="São Paulo"
                    saida="08:00"
                    data="30 de Dezembro"
                    preco="R$ 800,00"
                    onPress={() =>
                      bannerVooPressionado({
                        imagens: [
                          require("../../assets/images/voos/maceio.jpg"),
                          require("../../assets/images/voos/maceio-2.jpg"),
                          require("../../assets/images/voos/maceio-3.jpg"),
                        ],
                        destino: "Maceio",
                        origem: "São Paulo",
                        descricao: "Cidade turística mais visitada do Brasil",
                        saida: "08:00",
                        data: "30 de Dezembro",
                        preco: "R$ 800,00",
                      })
                    }
                  />
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
  containerFavoritosLista:{
   

  }
});