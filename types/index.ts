import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigationProp } from "@react-navigation/core";
import { ProductResponseSuccess } from "../lib/supabase";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  ChangePassword: undefined;
  Profile: { userId: string };
  Feed: { sort: "latest" | "top" } | undefined;
};

export interface ScreenProps {
  navigation?: any;
  route?: any;
}
export type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export type Product = {
  isSelected: boolean;
  [x: string]: any;
} & ProductResponseSuccess;
