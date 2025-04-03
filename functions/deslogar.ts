import AsyncStorage from '@react-native-async-storage/async-storage';

const logout = async (navigation) => {
  try {
    // Remove o token do AsyncStorage
    await AsyncStorage.removeItem('userToken');
    
    // Redireciona para a tela de login
    navigation.reset({
      index: 0,
      routes: [{ name: 'index' }],
    });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);

    navigation.reset({
      index: 0,
      routes: [{ name: 'index' }],
    });
  }
};

export default logout;