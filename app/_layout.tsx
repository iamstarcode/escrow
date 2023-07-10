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

import { Provider } from "react-redux";
import { store } from "../store/store";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "/",
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {

        // Pre-load fonts, make any API calls you need to do here
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
      // Hide the splash screen after the fonts have loaded and the
      // UI is ready.
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null
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
