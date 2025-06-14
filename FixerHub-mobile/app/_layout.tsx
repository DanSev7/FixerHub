import React, { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { darkTheme, lightTheme } from '@/styles/colorTheme';
// Import useColorScheme hook and ColorSchemeProvider
import {
  ColorSchemeProvider,
  useColorScheme,
} from '@/contexts/ColorSchemeContext';
import CustomHeader from '@/components/ui/CustomHeader';

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  // Get the active color scheme from the context

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    // <ThemeProvider
    //   value={activeColorScheme === 'dark' ? darkTheme : lightTheme}
    // >
    <ThemeProvider value={lightTheme}>
      {/* AuthStateGate ensures auth and theme are loaded before Stack renders */}
      <Stack
        screenOptions={{
          header: () => <CustomHeader />,
        }}
      >
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(client)' />
        <Stack.Screen name='(professional)' />
        <Stack.Screen name='(profile)' />
        <Stack.Screen name='+not-found' />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@/assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync() is handled in RootLayoutContent
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Wrap the entire RootLayoutContent with ColorSchemeProvider
  return (
    <ColorSchemeProvider>
      <RootLayoutContent />
    </ColorSchemeProvider>
  );
}
