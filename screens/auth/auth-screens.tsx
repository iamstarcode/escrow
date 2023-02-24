import SignIn from './signin';
import SingUp from './signup';
import ForgotPassword from './forgot-password';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

export default function AuthScreens() {
  const RootStack = createNativeStackNavigator<RootStackParamList>();

  return (
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

      {/*   <ForgotPassword /> */}
    </>
  );
}
