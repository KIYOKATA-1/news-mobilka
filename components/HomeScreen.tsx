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
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
interface Props {
  onLogout: () => void;
}
export default function HomeScreen({ onLogout }: Props) {
  const [loadingWebView, setLoadingWebView] = useState(true);
  const [lastFileUrl, setLastFileUrl] = useState<string>("");

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });
      if (res.canceled) {
        return;
      }

      const asset = res.assets[0];
      const { uri, name } = asset;
      const response = await fetch(uri);
      const blob = await response.blob();

      const uploadUrl = `https://transfer.sh/${name}`;
      const uploadResp = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
      });
      if (!uploadResp.ok) throw new Error(`HTTP ${uploadResp.status}`);

      const fileUrl = await uploadResp.text();
      setLastFileUrl(fileUrl);
      Alert.alert("Успех", `Файл загружен:\n${fileUrl}`);
    } catch (e) {
      console.warn(e);
      Alert.alert("Ошибка", "Не удалось загрузить файл.");
    }
  };

  const handleFileDownload = async () => {
    if (!lastFileUrl) {
      Alert.alert("Внимание", "Сначала загрузите файл, чтобы скачать его.");
      return;
    }

    try {
      const filename = lastFileUrl.split("/").pop() || "download.bin";
      const localPath = FileSystem.documentDirectory + filename;
      const { uri } = await FileSystem.downloadAsync(lastFileUrl, localPath);
      Alert.alert("Успех", `Файл сохранён по пути:\n${uri}`);
    } catch (e) {
      console.warn(e);
      Alert.alert("Ошибка", "Не удалось скачать файл.");
    }
  };
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
        <TouchableOpacity
          onPress={handleFileUpload}
          style={HomeStyle.uploadButton}
        >
          <Text style={HomeStyle.btnTxt}>Загрузить файл</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFileDownload}
          style={HomeStyle.downloadButton}
        >
          <Text style={HomeStyle.btnTxt}>Скачать файл</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} style={HomeStyle.logoutButton}>
          <Text style={HomeStyle.btnTxt}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
