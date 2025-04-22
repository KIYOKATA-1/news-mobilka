import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { LoginStyle } from "../styles/Login.styles";
import ReactNativeBiometrics from "react-native-biometrics";

interface Props {
  onAuthSuccess: () => void;
}

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

export default function LoginScreen() {
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

  return (
    <SafeAreaView style={LoginStyle.container}>
      <Text style={LoginStyle.title}>Авторизация</Text>
      <TouchableOpacity style={LoginStyle.loginBtn}>
        <Text style={LoginStyle.btnTxt}>Войти</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
