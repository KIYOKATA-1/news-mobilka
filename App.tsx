import React, { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      {/* <LoginScreen/> */}
      <HomeScreen/>

    </>
  );
}
