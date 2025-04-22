import React, { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import { StatusBar } from "react-native";

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {authenticated ? (
        <HomeScreen />
      ) : (
        <LoginScreen onAuthSuccess={() => setAuthenticated(true)} />
      )}
    </>
  );
}
