import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import BannerHotel from "@/components/Banner-Hotel/BannerHotel";
import BannerVoo from "@/components/Banner-Voo/BannerVoo";
import ModalHotel from "@/components/Modal/ModalHotel";
import ModalVoo from "@/components/Modal/ModalVoo";
import verificarToken from "../verificarToken";

export default function Explorar() {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("hoteis");
  const [modalHotelVisivel, setModalHotelVisivel] = useState(false);
  const [modalVooVisivel, setModalVooVisivel] = useState(false);
  const [hotelSelecionado, setHotelSelecionado] = useState(null);
  const [vooSelecionado, setVooSelecionado] = useState(null);
  const [hoteis, setHoteis] = useState([]);
  const [voos, setVoos] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [favoritandoIds, setFavoritandoIds] = useState({}); // Alterado para rastrear múltiplos itens
  const [notificacao, setNotificacao] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    verificarToken(navigation);
  }, [navigation]);

  const carregarFavoritos = async (token, usuarioId) => {
    try {
      const favoritosCache = await AsyncStorage.getItem(`favoritos_${usuarioId}`);
      if (favoritosCache) {
        setFavoritos(JSON.parse(favoritosCache));
      }

      const novosFavoritos = {};

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
      }

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
      }

      await AsyncStorage.setItem(`favoritos_${usuarioId}`, JSON.stringify(novosFavoritos));
      setFavoritos(novosFavoritos);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error.message || error);
    }
  };

  const toggleFavorito = async (id, tipo) => {
    const chave = `${tipo}_${id}`;
    try {
      setFavoritandoIds(prev => ({ ...prev, [chave]: true }));
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("idUsuario");

      if (!token || !usuarioId) {
        console.error("Token ou ID do usuário não encontrado");
        setNotificacao("Erro: Faça login novamente");
        setTimeout(() => setNotificacao(null), 3000);
        return;
      }

      const estaFavoritado = favoritos[chave];
      const url = `https://backend-viajados.vercel.app/api/favoritos/${
        tipo === "hotel" ? "hoteis" : "voos"
      }`;

      console.log("Antes de favoritar:", { id, tipo, estaFavoritado });

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
        await carregarFavoritos(token, usuarioId);
        
        const mensagem = estaFavoritado
          ? tipo === "hotel"
            ? "Hotel foi removido dos favoritos!"
            : "Voo foi removido dos favoritos!"
          : tipo === "hotel"
          ? "Hotel foi adicionado aos favoritos!"
          : "Voo foi adicionado aos favoritos!";
        setNotificacao(mensagem);
        setTimeout(() => setNotificacao(null), 3000);
        console.log("Depois de favoritar:", favoritos);
      } else {
        let errorMessage = "Erro desconhecido";
        try {
          const errorText = await response.text();
          errorMessage = errorText || `Erro ${response.status}`;
        } catch (e) {
          errorMessage = `Erro ${response.status}`;
        }
        console.error("Erro ao atualizar favorito:", errorMessage);
        setNotificacao("Erro ao atualizar favorito");
        setTimeout(() => setNotificacao(null), 3000);
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
      setNotificacao("Erro ao atualizar favorito");
      setTimeout(() => setNotificacao(null), 3000);
    } finally {
      setFavoritandoIds(prev => ({ ...prev, [chave]: false }));
    }
  };

  const carregarDadosUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("idUsuario");
      
      if (!token || !usuarioId) {
        console.error("Token ou ID do usuário não encontrado");
        return;
      }

      // Atualiza o ID do usuário no estado
      setIdUsuario(usuarioId);
      
      // Busca nome atualizado do AsyncStorage
      const nome = await AsyncStorage.getItem("nome");
      if (nome) setNomeUsuario(nome);
      
      // Busca dados atualizados do usuário da API
      const respostaUsuario = await fetch(
        `https://backend-viajados.vercel.app/api/alterardados/dadosusuario?idUsuario=${usuarioId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (respostaUsuario.ok) {
        const dadosUsuario = await respostaUsuario.json();
        if (dadosUsuario.length > 0) {
          // Atualiza nome do AsyncStorage se diferente
          const nomeAtualizado = dadosUsuario[0].nome || "";
          if (nomeAtualizado && nomeAtualizado !== nomeUsuario) {
            await AsyncStorage.setItem("nome", nomeAtualizado);
            setNomeUsuario(nomeAtualizado);
          }
          
          // Atualiza foto
          const foto = dadosUsuario[0].foto_usuario;
          setFotoUsuario(
            foto
              ? foto.startsWith("data:")
                ? foto
                : `data:image/jpeg;base64,${foto}`
              : null
          );
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("idUsuario");

      if (!token || !usuarioId) {
        console.error("Token ou ID do usuário não encontrado");
        return;
      }

      // Carrega dados do usuário
      await carregarDadosUsuario();
      
      // Carrega favoritos
      await carregarFavoritos(token, usuarioId);

      // Carrega hotéis
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

      if (respostaHoteis.ok) {
        const dadosHoteis = await respostaHoteis.json();
        setHoteis(
          Array.isArray(dadosHoteis) ? dadosHoteis : dadosHoteis.data || []
        );
      }

      // Carrega voos
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

      if (respostaVoos.ok) {
        const dadosVoos = await respostaVoos.json();
        setVoos(Array.isArray(dadosVoos) ? dadosVoos : dadosVoos.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Usa useFocusEffect para recarregar os dados sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      // Recarrega os dados do usuário e demais informações quando a tab recebe foco
      carregarDados();
      
      // Retorna uma função de limpeza caso necessário
      return () => {
        // Código de limpeza se necessário
      };
    }, [])
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
        <TouchableOpacity onPress={() => navigation.navigate("minhaConta")}>
          <View style={styles.containerInfoUsuario}>
            <Image
              source={
                fotoUsuario
                  ? { uri: fotoUsuario }
                  : require("../../assets/images/user-icon.png")
              }
              style={styles.avatar}
            />
            <View>
              <Text style={styles.saudacao}>Olá, {nomeUsuario || "Usuário"}</Text>
              <Text style={styles.texto}>Bem-vindo de volta!</Text>
            </View>
          </View>
        </TouchableOpacity>

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
                  <View style={styles.containerMensagem}>
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
                          : require("../../assets/images/defaultImage.jpg")
                      }
                      nome={hotel.nome || "Hotel sem nome"}
                      descricao={hotel.descricao || "Sem descrição"}
                      avaliacao={hotel.avaliacao || 0}
                      preco={hotel.preco_diaria || "Preço não disponível"}
                      onPress={() => bannerHotelPressionado(hotel)}
                      favorito={favoritos[`hotel_${hotel.idHoteis}`] || false}
                      onFavoritar={() => toggleFavorito(hotel.idHoteis, "hotel")}
                      isLoading={favoritandoIds[`hotel_${hotel.idHoteis}`]}
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
                  <View style={styles.containerMensagem}>
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
                          : require("../../assets/images/defaultImage.jpg")
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
                      isLoading={favoritandoIds[`voo_${voo.idVoos}`]}
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
  containerInfoUsuario: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
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
  containerMensagem: {
    marginTop: 90,
    marginLeft: 110,
  },
  mensagem: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
});