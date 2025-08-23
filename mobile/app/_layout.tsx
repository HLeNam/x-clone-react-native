import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "../global.css";

import InitialLayout from "@/components/InitialLayout";
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
  StatusBar,
} from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme === "dark") {
      setStatusBarStyle("light");
      setStatusBarBackgroundColor("#000000");
    }
  }, [colorScheme]);

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <InitialLayout />
        <StatusBar style="dark" />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
