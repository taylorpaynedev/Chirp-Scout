import { useColorScheme } from "react-native";

export interface Theme {
  dark: boolean;
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentText: string;
  headerBackground: string;
  headerText: string;
  tabBarBackground: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  thumbnailPlaceholder: string;
  photoPlaceholder: string;
}

export const lightTheme: Theme = {
  dark: false,
  background: "#f5f5f5",
  card: "#ffffff",
  cardBorder: "#e0e0e0",
  text: "#1a1a1a",
  textMuted: "#555555",
  textSubtle: "#999999",
  accent: "#4a90d9",
  accentText: "#ffffff",
  headerBackground: "#ffffff",
  headerText: "#1a1a1a",
  tabBarBackground: "#ffffff",
  tabBarBorder: "#e0e0e0",
  tabBarActive: "#4a90d9",
  tabBarInactive: "#aaaaaa",
  thumbnailPlaceholder: "#eeeeee",
  photoPlaceholder: "#dddddd",
};

export const darkTheme: Theme = {
  dark: true,
  background: "#0f0f10",
  card: "#1c1c1e",
  cardBorder: "#2c2c2e",
  text: "#f5f5f7",
  textMuted: "#b0b0b3",
  textSubtle: "#6e6e72",
  accent: "#5aa7ef",
  accentText: "#ffffff",
  headerBackground: "#1c1c1e",
  headerText: "#f5f5f7",
  tabBarBackground: "#1c1c1e",
  tabBarBorder: "#2c2c2e",
  tabBarActive: "#5aa7ef",
  tabBarInactive: "#6e6e72",
  thumbnailPlaceholder: "#2c2c2e",
  photoPlaceholder: "#2c2c2e",
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
}
