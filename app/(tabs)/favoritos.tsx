import { Text, ScrollView } from "react-native";

import BannerHotelFavoritos from "@/components/Banner-Hotel/BannerHotelFavoritos";
import BannerVooFavoritos from "@/components/Banner-Voo/BannerVooFavoritos";

export default function Favoritos() {
  return (
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
        onPress={() => console.log("Hotel selecionado!")}
      />
      <BannerVooFavoritos
        imagem={require("../../assets/images/voos/sp.jpg")}
        destino="São Paulo"
        origem="Rio de Janeiro"
        saida="08:00"
        data="01 de Abril"
        preco="R$ 300,00"
        onPress={() => console.log("Voo selecionado!")}
      />
    </ScrollView>
  );
}
