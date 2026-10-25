import "@/global.css";

import { Stack, ThemeProvider } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { RiyadahDarkTheme, RiyadahLightTheme } from "@/constants/theme";

// NativeWind / react-native-css-interop darkMode flag for web
if (Platform.OS === "web") {
  try {
    (StyleSheet as unknown as { setFlag?: (k: string, v: string) => void }).setFlag?.("darkMode", "class");
  } catch {}
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? RiyadahDarkTheme : RiyadahLightTheme;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}