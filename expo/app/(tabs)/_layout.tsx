import React from "react";
import { Tabs } from "expo-router";
import { Home, Search, ShoppingBag, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useCartStore } from "@/store/cartStore";
import { StyleSheet, View, Text } from "react-native";
import appInfo from "@/constants/appInfo";

export default function TabLayout() {
  const cartItemsCount = useCartStore(state => state.getCartItemsCount());

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor: Colors.dark.border,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.subtext,
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: appInfo.name,
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          tabBarLabel: "Home"
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <View>
              <ShoppingBag size={24} color={color} />
              {cartItemsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: Colors.dark.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.dark.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
});