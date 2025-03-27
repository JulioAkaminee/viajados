import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function MinhaConta() {
  const [modalVisivel, setModalVisivel] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.containerInformacoes}>
        <View style={styles.fotoNome}>
          <Image
            source={require("../../assets/images/user-icon.png")}
            style={styles.imagemPerfil}
          />
          <Text style={styles.nome}>Nome</Text>
          <Pressable onPress={() => setModalVisivel(true)}>
            <MaterialIcons name={"edit"} size={35} color="#D6005D" />
          </Pressable>
        </View>

        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>Número de telefone:</Text>{" "}
          11978105988
        </Text>
        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>CPF:</Text> 000.000.000-00
        </Text>
        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>Data de nascimento:</Text>{" "}
          11/02/1999
        </Text>
        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>Nacionalidade:</Text> Brasileiro
        </Text>
        <Text style={styles.informacoes}>
          <Text style={{ fontWeight: "bold" }}>Sexo:</Text> Masculino
        </Text>
      </View>

      <Text style={styles.legenda}>Sair da conta</Text>
      <Pressable style={styles.botao} onPress={() => {}}>
        <Text style={styles.textoBotao}>Sair</Text>
      </Pressable>

      <Text style={styles.legenda}>Eliminar minha conta</Text>
      <Text style={styles.textoAviso}>
        Se você eliminar a sua conta, não será possível recuperá-la depois.
      </Text>
      <Pressable style={[styles.botao, styles.botaoEliminar]} onPress={() => {}}>
        <Text style={styles.textoBotao}>Eliminar</Text>
      </Pressable>

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.containerModal}>
          <View style={styles.conteudoModal}>
            <View style={styles.secaoModal}>
              <Image
                source={require("../../assets/images/user-icon.png")}
                style={{ left: 130, marginBottom: 10, ...styles.imagemPerfil }}
              />
              <Pressable onPress={() => setModalVisivel(false)}>
                <Text style={styles.botaoFechar}>
                  <MaterialIcons name={"close"} size={35} color="#D6005D" />
                </Text>
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nome"
            />
            <TextInput
              style={styles.input}
              placeholder="Número de Telefone"
            />
            <Pressable style={styles.botao} onPress={() => {}}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDD5E9",
    alignItems: "center",
    paddingTop: 50,
  },
  containerInformacoes: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  fotoNome: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 20,
  },
  imagemPerfil: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 10,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    textAlign: "center",
    marginTop: 35,
    marginLeft: 75,
  },
  informacoes: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    textAlign: "left",
    width: "100%",
  },
  legenda: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D6005D",
    marginTop: 20,
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#D6005D",
    padding: 12,
    borderRadius: 20,
    width: "40%",
    alignItems: "center",
    marginTop: 10,
  },
  botaoEliminar: {
    backgroundColor: "#D6005D",
  },
  textoBotao: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  textoAviso: {
    color: "#000",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    width: "80%",
  },
  containerModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  conteudoModal: {
    backgroundColor: "#FFCCE0",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
  },
  secaoModal: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoFechar: {
    fontSize: 24,
    color: "#FF007F",
    position: "absolute",
    top: 8,
    right: 4,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
