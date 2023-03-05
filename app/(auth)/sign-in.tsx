import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { Prompt, ResponseType } from 'expo-auth-session';
import * as SecureStorage from 'expo-secure-store';

//WebBrowser.maybeCompleteAuthSession();

import {
  Box,
  Center,
  FormControl,
  HStack,
  VStack,
  Text,
  Flex,
  Checkbox,
  Icon,
  ScrollView,
} from 'native-base';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import MInput from '../../components/ui/Input';
import MButton from '../../components/ui/Button';

import { fontRegular } from '../../styles';

import GoogeIcon from '../../assets/img/googleicon.svg';
import SigninIcon from '../../assets/img/singinicon.svg';
import { AntDesign } from '@expo/vector-icons';

import { ScreenProps } from '../../types';

import React from 'react';

import { Alert } from 'react-native';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { useAuth } from './provider';
import { useRouter } from 'expo-router';
interface SignUpProps extends ScreenProps {}

export default function SignIn({}: SignUpProps) {
  //const dispatch = useAppDispatch();

  const router = useRouter();
  const { setUser } = useAuth();
  const supabase = useSupabaseClient();

  const [show, setShow] = useState(false);
  const [facebokLoading, setFacebookLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showOnboard, setShowOnboard] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const { error, data: res } = await supabase.auth.signInWithPassword({
      ...data,
    });

    console.log('res ', res);
    setLoading(false);

    if (res?.user) {
      //  setUser(res.user);
    } else {
      Alert.alert('Error', error?.message ?? '');
    }
  };

  return (
    <Box flex={1} px='3' pb='5'>
      <ScrollView>
        <Center mt='24'>
          <SigninIcon />

          <Text style={{ ...fontRegular }} mt='8' mb='2' fontSize='2xl'>
            Sign in to Awseome
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
          <HStack space={2} justifyContent='flex-end'>
            <Text style={{ ...fontRegular }}>Remember Me</Text>
            <Controller
              name='rememberMe'
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  value={value + ''}
                  isChecked={value}
                  onChange={onChange}
                  accessibilityLabel='remember-me'
                />
              )}
            />
          </HStack>
          <MButton
            isLoading={loading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            _text={{ fontSize: 18 }}
          >
            Sign in
          </MButton>

          <VStack space='2'>
            <MButton
              bg='white'
              color='primary.500'
              leftIcon={<Icon as={GoogeIcon} />}
              onPress={() => {}}
              isLoading={googleLoading}
              _loading={{
                bg: 'gray.400',
              }}
              _text={{ color: 'primary.500' }}
            >
              Sign in with Google
            </MButton>
            <MButton
              bg='#1877f2'
              leftIcon={
                <Icon as={AntDesign} name='facebook-square' size='lg' />
              }
              onPress={() => {}}
              isLoading={facebokLoading}
            >
              <Text style={{ ...fontRegular }} color='white' fontSize={18}>
                Sign in with Facebook
              </Text>
            </MButton>
          </VStack>
          <Flex direction='row' justifyContent='space-between'>
            <Text
              onPress={() => router.push('forgot-password')}
              style={{ ...fontRegular }}
              color='primary.400'
              fontSize={14}
            >
              Forgot password
            </Text>
            <Text
              onPress={() => router.push('sign-up')}
              style={{ ...fontRegular }}
              color='primary.400'
              fontSize={14}
            >
              Create account
            </Text>
          </Flex>
        </VStack>
      </ScrollView>
    </Box>
  );
}
