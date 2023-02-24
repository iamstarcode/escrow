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
} from 'native-base';

import * as Linking from 'expo-linking';

import * as yup from 'yup';

//import IconSignUp from '../../assets/img/signupicon.svg'
import { ScreenProps } from '../../types';
import MInput from '../../components/ui/Input';
import MButton from '../../components/ui/Button';

import { fontMedium, fontRegular } from '../../styles/index';
import { useEffect, useState } from 'react';

import SigninIcon from '../../assets/img/signupicon.svg';

import { MaterialIcons } from '@expo/vector-icons';

import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Alert, SafeAreaView } from 'react-native';

interface ForgotPasswordProps extends ScreenProps {}

export default function ForgotPassword({
  route,
  navigation,
}: ForgotPasswordProps) {
  const supabase = useSupabaseClient();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const prefix = Linking.createURL('/');
  console.log(prefix);

  //const {} = useLinking

  const schema = yup.object().shape({
    email: yup.string().required().email('Must be a valid email'),
    password: yup.string().required('Please enter a password'),
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: 'iamstarcode@gmail.com',
      password: 'bakare007',
      rememberMe: false,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { error, data: res } = await supabase.auth.resetPasswordForEmail(
      data?.email,
      {
        redirectTo: 'com.iamstarcode.escrow://forget-password',
      }
    );

    setLoading(false);

    if (res) {
    } else {
      Alert.alert('Error', error?.message ?? '');
    }
  };

  useEffect(() => {
    //console.log(Linking.useURL());
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <Center mt='24'>
        <SigninIcon height={150} width={150} />

        <Text style={{ ...fontRegular }} mt='8' mb='2' fontSize='2xl'>
          Forgot password
        </Text>
      </Center>

      <VStack space='3'>
        <Controller
          name='email'
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.email}>
              <MInput
                autoComplete='email'
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder='Email'
                type='text'
              />
              <FormControl.ErrorMessage fontSize='xl'>
                {errors.email?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          name='password'
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.password}>
              <MInput
                type={show ? 'text' : 'password'}
                InputRightElement={
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? 'visibility' : 'visibility-off'}
                      />
                    }
                    size={5}
                    mr='2'
                    color='muted.400'
                    onPress={() => setShow(!show)}
                  />
                }
                autoComplete='password'
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder='Password'
              />
              <FormControl.ErrorMessage fontSize='xl'>
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

        <MButton
          onPress={async () => {
            const { data, error } = await supabase.auth.verifyOtp({
              type: 'recovery',
              email: 'iamstarcode@gmail.com',
              token: '384510',
            });
            console.log(data, error);
          }}
        >
          Verify otp
        </MButton>
        <Center pt={5}>
          <Text style={{ ...fontRegular }} color='coolGray.900' fontSize={14}>
            Alraedy have an account?{' '}
            <Text
              onPress={() => navigation.navigate('SignIn')}
              style={{ ...fontRegular }}
              color='primary.400'
              fontSize={14}
            >
              Sign In
            </Text>
          </Text>
        </Center>
      </VStack>
    </SafeAreaView>
  );
}
