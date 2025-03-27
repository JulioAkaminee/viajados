const deletar = async (usuarioId, token, navigation) => {
  try {
    const response = await fetch(
      `https://backend-viajados.vercel.app/api/alterardados/excluir?idUsuario=${usuarioId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Conta deletada com sucesso:", data);
    } else {
      console.error("Erro ao deletar conta:", data);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "index" }],
    });
  } catch (error) {
    console.error("Erro ao deletar conta:", error);

    navigation.reset({
      index: 0,
      routes: [{ name: "index" }],
    });
  }
};

export default deletar;
