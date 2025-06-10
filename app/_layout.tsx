import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { BackHandler, Alert, Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

export const unstable_settings = {
  initialRouteName: "index",
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.dark.background,
            },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: Colors.dark.background,
            },
            headerBackTitle: "Back",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="product/[id]" 
            options={{ 
              title: "Product Details",
            }} 
          />
          <Stack.Screen 
            name="category/[id]" 
            options={{ 
              title: "Category",
            }} 
          />
          <Stack.Screen 
            name="cart" 
            options={{ 
              title: "Your Cart",
            }} 
          />
          <Stack.Screen 
            name="checkout" 
            options={{ 
              title: "Checkout",
            }} 
          />
          <Stack.Screen 
            name="order-confirmation" 
            options={{ 
              title: "Order Confirmation",
              gestureEnabled: false,
              headerLeft: () => null,
            }} 
          />
          <Stack.Screen 
            name="order/[id]" 
            options={{ 
              title: "Order Details",
            }} 
          />
          <Stack.Screen 
            name="sign-in" 
            options={{ 
              title: "Sign In",
              headerShown: false,
              gestureEnabled: false,
            }} 
          />
          <Stack.Screen 
            name="sign-up" 
            options={{ 
              title: "Create Account",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="forgot-password" 
            options={{ 
              title: "Reset Password",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="terms" 
            options={{ 
              title: "Terms of Service",
            }} 
          />
          <Stack.Screen 
            name="privacy" 
            options={{ 
              title: "Privacy Policy",
            }} 
          />
        </Stack>
      </QueryClientProvider>
    </trpc.Provider>
  );
}