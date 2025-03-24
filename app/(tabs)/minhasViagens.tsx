import React from "react";
import { Text, View } from "react-native";

export default function minhasViagens() {
  {/*
    pegando os dados utilizando api:

    const [hoteis, setHoteis] = useState([]);
    const [voos, setVoos] = useState([]);

    useEffect(() => {
      fetch("http://localhost:3000/hoteis")
        .then((response) => response.json())
        .then((data) => setHoteis(data))
        .catch((error) => console.error("Erro ao buscar hotéis:", error));

      fetch("http://localhost:3000/voos")
        .then((response) => response.json())
        .then((data) => setVoos(data))
        .catch((error) => console.error("Erro ao buscar voos:", error));
    }, []);
  */}

  return (
    <View>
      <Text>Minhas Viagens</Text>
    </View>
  );
}
