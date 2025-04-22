import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { LoginStyle } from "../styles/Login.styles";
import ReactNativeBiometrics from "react-native-biometrics";

interface Props {
  onAuthSuccess: () => void;
}

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

export default function LoginScreen({ onAuthSuccess }: Props) {
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    rnBiometrics
      .isSensorAvailable()
      .then(({ available, biometryType }) => {
        if (available && biometryType) {
          setBiometryType(biometryType);
        } else {
          setBiometryType(null);
        }
      })
      .catch(() => setBiometryType(null))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = () => {
    rnBiometrics
      .simplePrompt({ promptMessage: "Подтвердите личность" })
      .then(({ success, error }) => {
        if (success) {
          onAuthSuccess();
        } else {
          Alert.alert("Ошибка", error || "Отменено пользователем");
        }
      })
      .catch(() => Alert.alert("Ошибка", "Не удалось выполнить биометрию"));
  };

  if (loading) {
    return (
      <SafeAreaView style={LoginStyle.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={LoginStyle.container}>
      <Text style={LoginStyle.title}>Авторизация</Text>
      <TouchableOpacity style={LoginStyle.loginBtn} onPress={handleAuth}>
        <Text style={LoginStyle.btnTxt}>Войти</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
