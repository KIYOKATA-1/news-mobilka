import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { HomeStyle } from "../styles/Home.styles";
import { WebView } from "react-native-webview";
interface Props {
  onLogout: () => void;
}
export default function HomeScreen({ onLogout }: Props) {
  const [loadingWebView, setLoadingWebView] = useState(true);

  return (
    <SafeAreaView style={HomeStyle.container}>
      {loadingWebView && <ActivityIndicator size="large" />}
      <WebView
        source={{ uri: "https://news-app-eight-cyan.vercel.app" }}
        onLoadEnd={() => setLoadingWebView(false)}
        onError={() =>
          Alert.alert("Ошибка", "Не удалось загрузить веб-приложение")
        }
        javaScriptEnabled
        domStorageEnabled
        style={HomeStyle.webview}
      />
      <View style={HomeStyle.footer}>
        <TouchableOpacity onPress={onLogout} style={HomeStyle.logoutButton}>
          <Text style={HomeStyle.btnTxt}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
