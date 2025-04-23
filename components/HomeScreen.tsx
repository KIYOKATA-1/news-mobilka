import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { HomeStyle } from "../styles/Home.styles";

interface Props {
  onLogout: () => void;
}

export default function HomeScreen({ onLogout }: Props) {
  const [loadingWebView, setLoadingWebView] = useState(true);
  const [lastFileUrl, setLastFileUrl] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  const sliderWidth = Dimensions.get("window").width * 0.6;
  const slideAnim = useRef(new Animated.Value(sliderWidth)).current;

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: sliderWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      const { uri, name } = res.assets[0];
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
    } catch {
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
      const { uri } = await FileSystem.downloadAsync(
        lastFileUrl,
        localPath
      );
      Alert.alert("Успех", `Файл сохранён по пути:\n${uri}`);
    } catch {
      Alert.alert("Ошибка", "Не удалось скачать файл.");
    }
  };

  return (
    <SafeAreaView style={HomeStyle.container}>
      <View style={HomeStyle.header}>
        <TouchableOpacity onPress={openMenu} style={HomeStyle.burgerButton}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

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

      {menuOpen && (
        <>
          <TouchableOpacity
            style={HomeStyle.overlay}
            activeOpacity={1}
            onPress={closeMenu}
          />
          <Animated.View
            style={[
              HomeStyle.sideMenu,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />

            <View style={HomeStyle.sideMenuContent}>
              <TouchableOpacity
                style={HomeStyle.sideButton}
                onPress={handleFileUpload}
              >
                <Text style={HomeStyle.sideButtonText}>Загрузить файл</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={HomeStyle.sideButton}
                onPress={handleFileDownload}
              >
                <Text style={HomeStyle.sideButtonText}>Скачать файл</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={HomeStyle.sideButton}
                onPress={() => {
                  closeMenu();
                  onLogout();
                }}
              >
                <Text style={HomeStyle.sideButtonText}>Выйти</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}
