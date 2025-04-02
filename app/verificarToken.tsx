import AsyncStorage from '@react-native-async-storage/async-storage';

export const verificarToken = async (navigation: any) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'loading' }],
      });
    }
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    navigation.reset({
      index: 0,
      routes: [{ name: 'loading' }],
    });
  }
};

export default verificarToken;
