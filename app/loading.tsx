import { useNavigation } from '@react-navigation/native';

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Loading = ({ navigation : any }) => {
  
  const navigation = useNavigation();
  useEffect(() => {
    if (!navigation) {
      console.error('Navigation não está definido');
      return;
    }

    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'index' }],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.message}>Token de usuario não encontrado...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Loading;