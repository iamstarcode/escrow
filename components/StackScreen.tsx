import { Stack } from 'expo-router';
import React from 'react';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack/src/types';

export default function StackScreen(props: NativeStackNavigationOptions) {
  return (
    <Stack.Screen
      options={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: '#7258f3' },
        ...props,
      }}
    />
  );
}
