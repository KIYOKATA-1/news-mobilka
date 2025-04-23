import React, { useState, useRef, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Platform, StatusBar } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();


  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) setExpoPushToken(token);
        console.log("Push Token:", token);
      })
      .catch(console.warn);

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Получено уведомление:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Нажали на уведомление:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {authenticated ? (
        <HomeScreen onLogout={() => setAuthenticated(false)} />
      ) : (
        <LoginScreen onAuthSuccess={() => setAuthenticated(true)} />
      )}
    </>
  );
}

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Ошибка", "Разрешение на уведомления не получено!");
      return;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync();
    token = tokenData.data;
  } else {
    Alert.alert(
      "Внимание",
      "Push-уведомления на эмуляторе не поддерживаются — используйте реальное устройство"
    );
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}