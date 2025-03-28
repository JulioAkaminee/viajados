import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import verificarToken from "../verificarToken";
import { useNavigation } from "@react-navigation/native";

export default function minhasViagens() {
    const navigation = useNavigation();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("agendado");

  const opcaoPressionada = (opcao) => {
    setOpcaoSelecionada(opcao);
  };
      useEffect(() => {
        verificarToken(navigation);
      }, [navigation]);

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
        <View style={styles.containerMinhasViagens}>
          <View style={styles.viewTitulo}>
            <Text style={styles.titulo}>Minhas Viagens</Text>
          </View>
          <View style={styles.filtroBusca}>
            <Pressable
              style={[
                styles.opcoesFiltro,
                opcaoSelecionada === "agendado" && styles.opcaoSelecionada,
              ]}
              onPress={() => opcaoPressionada("agendado")}
            >
              <Text
                style={[
                  styles.textoFiltro,
                  opcaoSelecionada === "agendado" &&
                    styles.textoFiltroSelecionado,
                ]}
              >
                Agendado
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.opcoesFiltro,
                opcaoSelecionada === "finalizado" && styles.opcaoSelecionada,
              ]}
              onPress={() => opcaoPressionada("finalizado")}
            >
              <Text
                style={[
                  styles.textoFiltro,
                  opcaoSelecionada === "finalizado" && styles.textoFiltroSelecionado,
                ]}
              >
                Finalizado
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
  containerMinhasViagens: {
    marginVertical: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 20,
    marginTop: 10,
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
});
