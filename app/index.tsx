import React from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

export default function index(){
return(
    <View>
        <Link href={"/(tabs)/explorar"}>
        
        <Text>Ola</Text>
        </Link>

        
    </View>
)
}