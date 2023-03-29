import React, { useCallback, useEffect, useRef, useState } from "react";
import { Slot, SplashScreen, Stack } from "expo-router";
import * as Font from "expo-font";

import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, Box } from "native-base";
import { AuthProvider } from "./(auth)/provider";

import { SWRConfig } from "swr";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "../lib/supabase";

import { theme } from "../config/native-base-config";
import { Alert, Platform } from "react-native";

import { Provider } from "react-redux";
import { store } from "../store/store";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "/",
};

/* Notifications.setNotificationHandler({
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
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
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
} */
export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  /*  useEffect(() => {
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
  }, []); */

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here

        //Check for refresh token if any, continue until next until next API request hits
        await Font.loadAsync({
          EuclidCircularARegular: require("../assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Regular.ttf"),
          EuclidCircularABold: require("../assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Bold.ttf"),
          EuclidCircularAMedium: require("../assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Medium.ttf"),
          EuclidCircularALight: require("../assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Light.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <SplashScreen />;
  }

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isOnline() {
          /* Customize the network state detector */
          return true;
        },
        isVisible() {
          /* Customize the visibility state detector */
          return true;
        },
        initFocus(callback) {
          /* Register the listener with your state provider */
        },
        initReconnect(callback) {
          /* Register the listener with your state provider */
        },
      }}
    >
      <Provider store={store}>
        <SessionContextProvider supabaseClient={supabase}>
          <AuthProvider>
            <NativeBaseProvider theme={theme}>
              <Box onLayout={onLayoutRootView} flex={1} bg="white">
                <StatusBar
                  style="inverted"
                  animated={true}
                  backgroundColor="#3333334a"
                  translucent={true}
                />
                <Stack screenOptions={{ headerShown: false }} />
              </Box>
            </NativeBaseProvider>
          </AuthProvider>
        </SessionContextProvider>
      </Provider>
    </SWRConfig>
  );
}
