import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import Routes from "./src/routes";
import { NavigationContainer } from "@react-navigation/native";
import AuthProvider from "./src/contexts/auth";

console.disableYellowBox = true;

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
        <StatusBar style="light" translucent />
      </AuthProvider>
    </NavigationContainer>
  );
}
