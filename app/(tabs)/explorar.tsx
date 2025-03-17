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

import BannerHotel from "@/components/Banner-Hotel/BannerHotel";
import BannerVoo from "@/components/Banner-Voo/BannerVoo";

export default function Explorar() {
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
                <BannerHotel
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
                <BannerHotel
                  imagem={require("../../assets/images/hoteis/pousada-do-sol.jpg")}
                  nome="Pousada do Sol"
                  avaliacao={3}
                  inicio="12 de Abril"
                  fim="18 de Abril"
                  descricao="Aconchegante pousada no centro"
                  preco="R$ 150,00"
                  onPress={() =>
                    bannerHotelPressionado({
                      nome: "Pousada do Sol",
                      avaliacao: 3,
                      imagens: [
                        require("../../assets/images/hoteis/pousada-do-sol.jpg"),
                        require("../../assets/images/hoteis/pousada-do-sol-2.jpg"),
                        require("../../assets/images/hoteis/pousada-do-sol-3.jpg"),
                      ],
                      descricao: "Aconchegante pousada no centro",
                      localizacao: "Centro Histórico, Salvador/BA",
                      inicio: "12 de Abril",
                      fim: "18 de Abril",
                      preco: "R$ 150,00",
                    })
                  }
                />
                <BannerHotel
                  imagem={require("../../assets/images/hoteis/resort-das-aguias.jpg")}
                  nome="Resort das Águias"
                  avaliacao={5}
                  inicio="20 de Abril"
                  fim="25 de Abril"
                  descricao="Resort com piscinas termais"
                  preco="R$ 450,00"
                  onPress={() =>
                    bannerHotelPressionado({
                      nome: "Resort das Águias",
                      avaliacao: 5,
                      imagens: [
                        require("../../assets/images/hoteis/resort-das-aguias.jpg"),
                        require("../../assets/images/hoteis/resort-das-aguias-2.jpg"),
                        require("../../assets/images/hoteis/resort-das-aguias-3.jpeg"),
                      ],
                      descricao: "Resort com piscinas termais",
                      localizacao: "Serra Gaúcha, Porto Alegre/RS",
                      inicio: "20 de Abril",
                      fim: "25 de Abril",
                      preco: "R$ 450,00",
                    })
                  }
                />
              </>
            )}
            {opcaoSelecionada === "voos" && (
              <>
                <BannerVoo
                  imagem={require("../../assets/images/voos/sp.jpg")}
                  destino="São Paulo"
                  origem="Rio de Janeiro"
                  descricao="Conheça a maior cidade do país"
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
                <BannerVoo
                  imagem={require("../../assets/images/voos/salvador.jpg")}
                  destino="Salvador"
                  origem="São Paulo"
                  descricao="Aproveite as belas praias da capital baiana"
                  saida="14:30"
                  data="02 de Abril"
                  preco="R$ 450,00"
                  onPress={() =>
                    bannerVooPressionado({
                      imagens: [
                        require("../../assets/images/voos/salvador.jpg"),
                        require("../../assets/images/voos/salvador-2.jpg"),
                        require("../../assets/images/voos/salvador-3.jpg"),
                      ],
                      destino: "Salvador",
                      origem: "São Paulo",
                      descricao: "Aproveite as belas praias da capital baiana",
                      saida: "14:30",
                      data: "02 de Abril",
                      preco: "R$ 450,00",
                    })
                  }
                />
                <BannerVoo
                  imagem={require("../../assets/images/voos/poa.jpg")}
                  destino="Porto Alegre"
                  origem="Curitiba"
                  descricao="Experimente o elogiado churrasco gaúcho"
                  saida="10:15"
                  data="03 de Abril"
                  preco="R$ 280,00"
                  onPress={() =>
                    bannerVooPressionado({
                      imagens: [
                        require("../../assets/images/voos/poa.jpg"),
                        require("../../assets/images/voos/poa-2.jpg"),
                        require("../../assets/images/voos/poa-3.jpeg"),
                      ],
                      destino: "Porto Alegre",
                      origem: "Curitiba",
                      descricao: "Experimente o elogiado churrasco gaúcho",
                      saida: "10:15",
                      data: "03 de Abril",
                      preco: "R$ 280,00",
                    })
                  }
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
