import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { HomeStyle } from "../styles/Home.styles";
export default function HomeScreen(){
    return(
        <SafeAreaView style={HomeStyle.container}>
            <View>
                <Text style={HomeStyle.title}>PLACE FOR WEBVIEW</Text>
            </View>
        </SafeAreaView>
    )
}