import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthModalHost } from '@/components/auth/auth-modal';
import { Palette } from '@/constants/design';
import { AuthModalProvider } from '@/providers/auth-modal-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { NotificationProvider } from '@/providers/notification-provider';
import { ToastProvider } from '@/providers/toast-provider';

void SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.primary,
    background: Palette.canvas,
    card: Palette.surface,
    text: Palette.text,
    border: Palette.border,
    notification: Palette.primary,
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Sora: require('@/assets/fonts/Sora.ttf'),
    Geist: require('@/assets/fonts/Geist.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <AuthModalProvider>
                <StatusBar style="dark" />

                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Palette.canvas },
                    animation: 'fade',
                  }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="auth/login" options={{ animation: 'slide_from_bottom' }} />
                  <Stack.Screen name="auth/register" options={{ animation: 'slide_from_bottom' }} />
                  <Stack.Screen name="tournaments" />
                  <Stack.Screen name="game-testing" />
                  <Stack.Screen name="bug-report" />
                </Stack>

                <AuthModalHost />
              </AuthModalProvider>
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
