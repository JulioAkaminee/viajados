import React from 'react';
import { View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

function TabBarIcon({
  name,
  color,
  focused,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      {focused && (
        <View
          style={{
            width: 30,
            height: 3,
            backgroundColor: '#d81b60', 
            borderRadius: 2,
            marginBottom: 5,
          }}
        />
      )}
      <FontAwesome size={24} name={name} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffe4e6',
          borderTopWidth: 0,
          height: 70,
        },
        tabBarIconStyle: { marginBottom: 5 },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          textTransform: 'none',
        },
        tabBarActiveTintColor: '#d81b60',
        tabBarInactiveTintColor: '#d81b60',
        tabBarItemStyle: { paddingVertical: 5 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="compass" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="minhasViagens"
        options={{
          title: 'Minhas Viagens',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="plane" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="heart" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="minhaConta"
        options={{
          title: 'Minha Conta',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
