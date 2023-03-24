import {
  Box,
  Center,
  Button,
  VStack,
  FormControl,
  Text,
  Icon,
  Checkbox,
  Flex,
  HStack,
  ScrollView,
} from "native-base";

import * as Linking from "expo-linking";

import * as yup from "yup";

//import IconSignUp from '../../assets/img/signupicon.svg'
import { ScreenProps } from "../types";
import MInput from "../components/ui/MInput";
import MButton from "../components/ui/MButton";

import { fontMedium, fontRegular } from "../styles/index";
import { useEffect, useState } from "react";

import SigninIcon from "../assets/img/signupicon.svg";

import { MaterialIcons } from "@expo/vector-icons";

import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Alert, SafeAreaView } from "react-native";
import { Stack } from "expo-router";

interface ChangePasswordProps extends ScreenProps {}

export default function ChangePassword({
  route,
  navigation,
}: ChangePasswordProps) {
  const supabase = useSupabaseClient();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required("Please enter your current password"),
    newPassword: yup.string().required("Please enter a new password").min(6),
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      currentPassword: "abcd1234",
      newPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);

    console.log(values.newPassword);
    const { data, error } = await supabase.rpc("change_user_password", {
      current_plain_password: values.currentPassword,
      new_plain_password: values.newPassword,
    });

    setLoading(false);

    if (data) {
      Alert.alert("Success", "Password changed sucesfully");
    } else {
      Alert.alert("Error", error?.message ?? "");
    }
  };

  useEffect(() => {
    //console.log(Linking.useURL());
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <Stack.Screen
        options={{
          title: "Change Password",
          headerShown: true,
        }}
      />
      <ScrollView>
        <Center mt="24">
          <SigninIcon height={150} width={150} />

          <Text style={{ ...fontRegular }} mt="8" mb="2" fontSize="2xl">
            Forgot password
          </Text>
        </Center>

        <VStack space="3">
          <Controller
            name="currentPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.currentPassword}>
                <MInput
                  type={showCurrent ? "text" : "password"}
                  InputRightElement={
                    <Icon
                      as={
                        <MaterialIcons
                          name={showCurrent ? "visibility" : "visibility-off"}
                        />
                      }
                      size={5}
                      mr="2"
                      color="muted.400"
                      onPress={() => setShowCurrent(!showCurrent)}
                    />
                  }
                  autoComplete="password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Password"
                />
                <FormControl.ErrorMessage fontSize="xl">
                  {errors.currentPassword?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.newPassword}>
                <MInput
                  type={showNew ? "text" : "password"}
                  InputRightElement={
                    <Icon
                      as={
                        <MaterialIcons
                          name={showNew ? "visibility" : "visibility-off"}
                        />
                      }
                      size={5}
                      mr="2"
                      color="muted.400"
                      onPress={() => setShowNew(!showNew)}
                    />
                  }
                  autoComplete="password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Password"
                />
                <FormControl.ErrorMessage fontSize="xl">
                  {errors.newPassword?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          <MButton
            isLoading={loading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            _text={{ fontSize: 18 }}
          >
            Change password
          </MButton>

          <Center pt={5}>
            <Text style={{ ...fontRegular }} color="coolGray.900" fontSize={14}>
              Alraedy have an account?{" "}
              <Text
                onPress={() => navigation.navigate("SignIn")}
                style={{ ...fontRegular }}
                color="primary.400"
                fontSize={14}
              >
                Sign In
              </Text>
            </Text>
          </Center>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
