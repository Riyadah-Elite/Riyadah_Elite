import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack, Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import '../index.css';

export default function RootLayout() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Ensure Google Fonts stylesheet link is registered (Sora, Inter, JetBrains Mono, DM Sans)
      const fontLinkId = 'riyadah-elite-google-fonts';
      if (!document.getElementById(fontLinkId)) {
        const link = document.createElement('link');
        link.id = fontLinkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap';
        document.head.appendChild(link);
      }

      const root = document.documentElement;
      root.classList.add('dark');
      root.style.setProperty('background-color', '#0B0D12', 'important');
      root.style.setProperty('color', '#F8FAFC', 'important');
      root.style.setProperty('overflow-x', 'hidden', 'important');
      root.style.setProperty('overflow-y', 'auto', 'important');
      root.style.setProperty('height', 'auto', 'important');
      root.style.setProperty('min-height', '100%', 'important');

      document.body.style.setProperty('background-color', '#0B0D12', 'important');
      document.body.style.setProperty('color', '#F8FAFC', 'important');
      document.body.style.setProperty('overflow-x', 'hidden', 'important');
      document.body.style.setProperty('overflow-y', 'auto', 'important');
      document.body.style.setProperty('min-height', '100vh', 'important');
      document.body.style.setProperty('height', 'auto', 'important');

      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.style.setProperty('display', 'block', 'important');
        rootEl.style.setProperty('min-height', '100vh', 'important');
        rootEl.style.setProperty('height', 'auto', 'important');
        rootEl.style.setProperty('background-color', '#0B0D12', 'important');
        rootEl.style.setProperty('color', '#F8FAFC', 'important');
        rootEl.style.setProperty('overflow-y', 'visible', 'important');
        rootEl.style.setProperty('overflow-x', 'hidden', 'important');
      }

      // Remove React Native Web default scroll locking style tag if injected
      const rnReset = document.getElementById('expo-reset');
      if (rnReset && rnReset.id !== 'riyadah-elite-scroller-fix') {
        rnReset.remove();
      }
    }
  }, []);

  if (Platform.OS === 'web') {
    return (
      <div className="w-full min-h-screen bg-[#0B0D12] text-[#F8FAFC] overflow-y-auto overflow-x-hidden selection:bg-accent-violet selection:text-white">
        <Slot />
      </div>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.dark.backgrounds.canvas },
        }}
      />
    </SafeAreaProvider>
  );
}

