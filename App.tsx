import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { AppProvider } from "./src/context/AppContext";
import { AppNavigator } from "./src/navigation";
import { darkTheme, lightTheme } from "./src/theme";

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.headerBackground,
      text: theme.headerText,
      border: theme.cardBorder,
      primary: theme.accent,
    },
  };

  return (
    <AppProvider>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <NavigationContainer theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
