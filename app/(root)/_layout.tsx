import React from "react";
import { SplashScreen, Stack, Tabs } from "expo-router";
import { Icon } from "native-base";
import { useAuth } from "../(auth)/provider";

import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "/",
};

export default function HomeLayout() {
  const { session } = useAuth();
  if (!session?.user) return <SplashScreen />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7258f3",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          href: {
            pathname: "/",
          },
          tabBarIcon: ({ color, size }) => (
            <Icon as={AntDesign} name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          href: {
            pathname: "/transactions",
          },
          tabBarIcon: ({ color, size }) => (
            <Icon
              as={MaterialIcons}
              name="event-note"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          href: {
            pathname: "/more",
          },
          tabBarIcon: ({ color, size }) => (
            <Icon as={Feather} name="loader" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
