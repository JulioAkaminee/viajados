import React from "react";
import { ScrollView } from "react-native";

import BannerHotel from "@/components/Banner-Hotel/BannerHotel";
import BannerVoo from "@/components/Banner-Voo/BannerVoo";
import BannerHotelFavoritos from "@/components/Banner-Hotel/BannerHotelFavoritos";
import BannerVooFavoritos from "@/components/Banner-Voo/BannerVooFavoritos";

export default function index() {
  return (
    <ScrollView>
      <BannerHotel
        imagem={require("../../assets/images/hotel.jpg")}
        nome="Hotel Maravilha"
        avaliacao={5}
        saida="14:00"
        data="20 de Dezembro"
        descricao="Um lindo hotel com vista para o mar"
        preco="R$ 300,00"
        onPress={() => console.log("Hotel selecionado!")}
      />
      <BannerVoo
        imagem={require("../../assets/images/voo.jpg")}
        destino="Rio de Janeiro"
        origem="São Paulo"
        descricao="Aproveite as belezas de copacabana"
        saida="22:00"
        data="10 de Maio"
        preco="R$ 1.000,00"
        onPress={() => console.log("Voo selecionado!")}
      />
      <BannerHotelFavoritos
        imagem={require("../../assets/images/hotel.jpg")}
        nome="Hotel Grandioso"
        avaliacao={2}
        saida="16:00"
        data="08 de Junho"
        descricao="Um lindo hotel com vista para o mar"
        preco="R$ 450,00"
        onPress={() => console.log("Hotel selecionado!")}
      />
      <BannerVooFavoritos
        imagem={require("../../assets/images/voo.jpg")}
        destino="Belo Horizonte"
        origem="Salvador"
        descricao="Conheça a incrível capital mineira"
        saida="09:00"
        data="31 de Outubro"
        preco="R$ 870,00"
        onPress={() => console.log("Voo selecionado!")}
      />
    </ScrollView>
  );
}
