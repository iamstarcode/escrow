import React, { useEffect, useRef, useState } from "react";
import { SplashScreen, Stack, Tabs } from "expo-router";
import { Icon } from "native-base";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";

import { useAuth } from "../(auth)/provider";
import { Platform } from "react-native";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "/",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken: any) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  try {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("expo noti token", token);
      //Alert.alert(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }
  } catch (error) {
    console.log(error);
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
export default function HomeLayout() {
  //const supabase =

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const { session } = useAuth();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification: any) => {
        setNotification(notification ?? "");
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!session?.user) return null;

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
          title: "Transactions",
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
          title: "More",
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
