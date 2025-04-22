import React from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { LoginStyle } from "../styles/Login.styles";

export default function LoginScreen() {
  return (
    <SafeAreaView style={LoginStyle.container}>
      <Text style={LoginStyle.title}>Авторизация</Text>
      <TouchableOpacity style={LoginStyle.loginBtn}>
        <Text>Войти</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
