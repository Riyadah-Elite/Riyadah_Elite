import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/AuthContext";
import { NavigationContainer } from "./navigation/NavigationContainer";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <NavigationContainer />
    </AuthProvider>
  );
}
