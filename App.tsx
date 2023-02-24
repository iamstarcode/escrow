import { useCallback, useEffect, useState, useContext } from 'react';

import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import { Box, NativeBaseProvider, View } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { theme } from './config/native-base-config';

import { AuthProvider } from './context/AuthContext';
import { AxiosProvider } from './context/AxiosContext';

//Screens
import SignIn from './screens/auth/signin';
import SingUp from './screens/auth/signup';
import Home from './screens/home';
import AuthScreens from './screens/auth/auth-screens';
import * as Linking from 'expo-linking';

import { RootStackParamList } from './types';
import { useAuth } from './context/AuthContext';
import { useAppSelector } from './app/hooks';
import { selectAuthenticated } from './app/features/auth/authSlice';
import React from 'react';
import ForgotPassword from './screens/auth/forgot-password';

const RootStack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  const config = {
    screens: {
      ForgotPassword: 'forgotpassword',
    },
  };
  const [appIsReady, setAppIsReady] = useState(false);
  const authenticated = useAppSelector(selectAuthenticated);

  const { session } = useAuth();
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here

        //Check for refresh token if any, continue until next until next API request hits
        await Font.loadAsync({
          EuclidCircularARegular: require('./assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Regular.ttf'),
          EuclidCircularABold: require('./assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Bold.ttf'),
          EuclidCircularAMedium: require('./assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Medium.ttf'),
          EuclidCircularALight: require('./assets/fonts/euclid-circular-a-cufonfonts/Euclid-Circular-A-Light.ttf'),
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
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AxiosProvider>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer
          linking={{
            prefixes: [Linking.createURL('/'), 'com.iamstarcode.escrow://'],
            config: config,
          }}
        >
          <Box onLayout={onLayoutRootView} flex={1} bg='coolGray.100'>
            <StatusBar
              style='inverted'
              animated={true}
              backgroundColor='#3333334a'
              translucent={true}
            />
            <RootStack.Navigator>
              {session?.user ? (
                <>
                  <RootStack.Screen
                    name='Home'
                    component={Home}
                    options={{ headerShown: false }}
                  />
                </>
              ) : (
                <>
                  <RootStack.Screen
                    name='SignIn'
                    component={SignIn}
                    options={{ headerShown: false }}
                  />
                  <RootStack.Screen
                    name='SignUp'
                    component={SingUp}
                    options={{ headerShown: false }}
                  />

                  <RootStack.Screen
                    name='ForgotPassword'
                    component={ForgotPassword}
                  />
                </>
              )}
            </RootStack.Navigator>
          </Box>
        </NavigationContainer>
      </NativeBaseProvider>
    </AxiosProvider>
  );
}
