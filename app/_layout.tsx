// app/_layout.tsx
import { i18n } from "@/i18n";
import { queryClient } from "@/lib/queryClient";
import { useLanguageStore } from "@/store/language.store";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppThemeProvider } from "../theme/ThemeProvider";



export default function RootLayout() {
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    i18n.locale = language;
  }, [language]);
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </SafeAreaProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
