import React, { useCallback, useEffect, useState } from 'react';
import { Slot, SplashScreen, Stack } from 'expo-router';
import * as Font from 'expo-font';

import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, Box } from 'native-base';
import { useAuth, AuthProvider } from './(auth)/provider';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '../lib/supabase';

import { theme } from '../config/native-base-config';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

export default function Layout() {
  const config = {
    screens: {
      ChangePassword: 'ChangePassword',
    },
  };
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here

        //Check for refresh token if any, continue until next until next API request hits
        await Font.loadAsync({
          EuclidCircularARegular: require('../assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Regular.ttf'),
          EuclidCircularABold: require('../assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Bold.ttf'),
          EuclidCircularAMedium: require('../assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Medium.ttf'),
          EuclidCircularALight: require('../assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Light.ttf'),
        });
        //get refreshToken
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
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <NativeBaseProvider theme={theme}>
          <Box onLayout={onLayoutRootView} flex={1} bg='coolGray.100'>
            <StatusBar
              style='inverted'
              animated={true}
              backgroundColor='#3333334a'
              translucent={true}
            />
            <Slot />
          </Box>
        </NativeBaseProvider>
      </AuthProvider>
    </SessionContextProvider>
  );
}
