import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import { fetchTopHeadlines } from "./api/news.api"; 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function setupAndroidChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      bypassDnd: true,
    });
  }
}

async function registerForPushNotificationsAsync() {
  if (!Constants.isDevice) {
    Alert.alert("Внимание", "Используйте реальное устройство для push-уведомлений.");
    return;
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    Alert.alert("Ошибка", "Нет разрешения на уведомления!");
    return;
  }
  const tokenData = await Notifications.getExpoPushTokenAsync();
  console.log("Push Token:", tokenData.data);
}

const BACKGROUND_FETCH_TASK = "news-fetch-task";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const { articles } = await fetchTopHeadlines(1);
    if (articles.length === 0) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
    const latest = articles[0];
    const lastStored = await AsyncStorage.getItem("LAST_NEWS_URL");
    if (latest.url !== lastStored) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📰 Появилась новая статья!",
          body: latest.title,
          data: { url: latest.url },
        },
        trigger: null, 
      });
      await AsyncStorage.setItem("LAST_NEWS_URL", latest.url);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }
    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Background fetch failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

async function registerBackgroundFetch() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60,  
    stopOnTerminate: false,     
    startOnBoot: true,          
  });
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setupAndroidChannel();
    registerForPushNotificationsAsync();
    registerBackgroundFetch();
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
