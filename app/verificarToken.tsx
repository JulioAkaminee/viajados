import AsyncStorage from '@react-native-async-storage/async-storage';

export const verificarToken = (navigation: any) => {
  if (!navigation) {
    console.error('Objeto de navegação não fornecido');
    return;
  }

  AsyncStorage.getItem('token')
    .then(token => {
     
      if (!token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'loading' }],
        });
      } else {
        // Se houver token, você pode decidir para onde ir

      }
    })
    .catch(error => {
      console.error('Erro ao verificar token:', error);
   
      navigation.reset({
        index: 0,
        routes: [{ name: 'loading' }],
      });
    });
};

export default verificarToken;