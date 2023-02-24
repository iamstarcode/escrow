import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/core';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  ForgotPassword: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
};

export interface ScreenProps {
  navigation?: any;
  route?: any;
}
export type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
