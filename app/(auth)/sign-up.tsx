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
} from "native-base";

import * as yup from "yup";

//import IconSignUp from '../../assets/img/signupicon.svg'
import { ScreenProps } from "../../types";
import { MButton, MInput, MText } from "../../components/ui";

import { fontMedium, fontRegular } from "../../styles/index";
import { useState } from "react";

import SigninIcon from "../../assets/img/signupicon.svg";

import { MaterialIcons } from "@expo/vector-icons";

import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

interface SingUpProps extends ScreenProps {}

export default function SingUp({}: SingUpProps) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    firstname: yup.string().required().min(3, "Name too short"),
    lastname: yup.string().required().min(3, "Name too short"),
    email: yup.string().required().email("Must be a valid email"),
    password: yup.string().required("Please enter a password"),
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "abcd1234@gmail.com",
      password: "abcd1234",
      rememberMe: false,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { error, data: res } = await supabase.auth.signUp({
      ...data,
    });

    await supabase
      .from("profiles")
      .update({ first_name: data.firstname, last_name: data.lastname })
      .eq("id", res.user?.id);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error?.message ?? "");
    }
  };
  return (
    <Box flex="1" px="3" bg="white">
      <Center mt="24">
        <SigninIcon height={150} width={150} />

        <Text style={{ ...fontRegular }} mt="8" mb="2" fontSize="2xl">
          Register with Awesome
        </Text>
      </Center>

      <VStack space="3">
        <Controller
          name="firstname"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.firstname}>
              <FormControl.Label>First name</FormControl.Label>
              <MInput
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter first name"
                type="text"
              />
              <FormControl.ErrorMessage fontSize="xl">
                {errors.firstname?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        />

        <Controller
          name="lastname"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.lastname}>
              <FormControl.Label>Last name</FormControl.Label>
              <MInput
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter your last name"
                type="text"
              />
              <FormControl.ErrorMessage fontSize="xl">
                {errors.lastname?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.email}>
              <FormControl.Label>Email</FormControl.Label>
              <MInput
                autoComplete="email"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Email"
                type="text"
              />
              <FormControl.ErrorMessage fontSize="xl">
                {errors.email?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.password}>
              <FormControl.Label>Password</FormControl.Label>
              <MInput
                type={show ? "text" : "password"}
                InputRightElement={
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? "visibility" : "visibility-off"}
                      />
                    }
                    size={5}
                    mr="2"
                    color="muted.400"
                    onPress={() => setShow(!show)}
                  />
                }
                autoComplete="password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Password"
              />
              <FormControl.ErrorMessage fontSize="xl">
                {errors.password?.message}
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
          Sign in
        </MButton>
        <Center pt={5}>
          <Text style={{ ...fontRegular }} color="coolGray.900" fontSize={14}>
            Alraedy have an account?{" "}
            <MText
              onPress={() => router.push("sign-in")}
              style={{ ...fontRegular }}
              color="primary.400"
              fontSize={14}
            >
              Sign In
            </MText>
          </Text>
        </Center>
      </VStack>
    </Box>
  );
}
