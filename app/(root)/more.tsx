import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from "native-base";

import * as yup from "yup";

import { FontAwesome, EvilIcons, MaterialIcons } from "@expo/vector-icons";

import { ScreenProps } from "../../types";
import MButton from "../../components/ui/MButton";

import { useEffect, useReducer, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAuth } from "../(auth)/provider";

import { Tabs, useRouter, Stack } from "expo-router";
import { View, Alert } from "react-native";

import StackScreen from "../../components/StackScreen";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MInput, MText } from "../../components/ui";
import { fontRegular } from "../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPABASE_STORAGE_KEY } from "../../config/constants";
import { color } from "native-base/lib/typescript/theme/styled-system";

export interface IHomeProps extends ScreenProps {}

interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
}

const defaultValues: IProfile | any = {
  firstName: "",
  lastName: "",
  email: "",
};

export default function Home({}: IHomeProps) {
  //const user = useAppSelector(selectUser);
  //const dispatch = useAppDispatch();

  //const { session } = useAuth();

  const supabase = useSupabaseClient();
  const router = useRouter();

  const [token, set] = useState<string | null>("");
  const [me, setMe] = useState("");

  const [profile, setProfile] = useReducer((prev: IProfile, next: IProfile) => {
    return { ...prev, ...next };
  }, defaultValues);

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required("First name is required")
      .min(3, "Name too short"),
    lastName: yup
      .string()
      .required("Last name is rquired")
      .min(3, "Name too short"),
    email: yup.string().required().email("Must be a valid email"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const initProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").single();
      const session = await AsyncStorage.getItem(SUPABASE_STORAGE_KEY);
      //console.log('parsed', JSON.parse(session ?? '').user.email);
      //console.log(data);
      setValue("firstName", data?.first_name);
      setValue("lastName", data?.last_name);
      setValue("email", JSON.parse(session ?? "").user.email);
    };

    initProfile();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    //const user = await AsyncStorage.getItem(SUPABASE_STORAGE_KEY);
    const session = await AsyncStorage.getItem(SUPABASE_STORAGE_KEY);

    console.log(data);
    const { error, data: res } = await supabase
      .from("profiles")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
      })
      .eq("id", JSON.parse(session ?? "").user.email);

    //await supabase.auth.updateUser()
    setLoading(false);

    if (error) {
      Alert.alert("Error", error?.message ?? "");
    }
  };

  return (
    <Box flex={1} safeArea bg="white">
      <StackScreen title="More" />
      <VStack space="3" px="3">
        <Pressable
          onPress={() => {
            router.push("/profile");
          }}
        >
          <HStack
            borderWidth={2}
            p="2"
            borderColor="warmGray.200"
            borderRadius="xl"
            alignItems="center"
            space={2}
          >
            <Box
              p="2"
              borderColor="warmGray.200"
              borderRadius="full"
              borderWidth={1}
            >
              <Icon
                borderColor="warmGray.200"
                as={EvilIcons}
                size={7}
                name="gear"
                color="primary.300"
              />
            </Box>

            <VStack flex={1}>
              <MText fontWeight="bold" fontSize={16} color="black">
                Profile
              </MText>
              <MText color="warmGray.400" fontSize={12}>
                Account, Bank details, Fund wallet
              </MText>
            </VStack>
            <Icon
              borderColor="warmGray.200"
              as={MaterialIcons}
              size={7}
              name="keyboard-arrow-right"
              color="primary.300"
            />
          </HStack>
        </Pressable>

        <MButton
          _text={{ color: "red.400" }}
          _pressed={{ bg: "warmGray.100" }}
          borderRadius="xl"
          borderWidth={2}
          borderColor="red.400"
          bg="transparent"
          onPress={async () => {
            await supabase.auth.signOut();
          }}
        >
          Sign out
        </MButton>
      </VStack>
    </Box>
  );
}
