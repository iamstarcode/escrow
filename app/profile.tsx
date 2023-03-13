import * as React from 'react';
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
  ScrollView,
  Text,
  VStack,
} from 'native-base';

import * as yup from 'yup';

import { EvilIcons, MaterialIcons } from '@expo/vector-icons';

import { ScreenProps } from '../types';
import MButton from '../components/ui/MButton';

import { useEffect, useReducer, useState } from 'react';
import useAxios from '../hooks/usesAxios';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from './(auth)/provider';

import { Tabs, useRouter, Stack } from 'expo-router';
import { View, Alert } from 'react-native';

import StackScreen from '../components/StackScreen';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MInput, MText } from '../components/ui';
import { fontRegular } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_STORAGE_KEY } from '../config/constants';

export interface IHomeProps extends ScreenProps {}

interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
}

const defaultValues: IProfile | any = {
  firstName: '',
  lastName: '',
  email: '',
};

export default function Profile() {
  //const user = useAppSelector(selectUser);
  //const dispatch = useAppDispatch();

  //const { session } = useAuth();

  const supabase = useSupabaseClient();
  const router = useRouter();

  const [token, set] = useState<string | null>('');
  const [me, setMe] = useState('');

  const [profile, setProfile] = useReducer((prev: IProfile, next: IProfile) => {
    return { ...prev, ...next };
  }, defaultValues);

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required('First name is required')
      .min(3, 'Name too short'),
    lastName: yup
      .string()
      .required('Last name is rquired')
      .min(3, 'Name too short'),
    email: yup.string().required().email('Must be a valid email'),
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
      const { data } = await supabase.from('profiles').select('*').single();
      const session = await AsyncStorage.getItem(SUPABASE_STORAGE_KEY);
      //console.log('parsed', JSON.parse(session ?? '').user.email);
      //console.log(data);
      setValue('firstName', data?.first_name);
      setValue('lastName', data?.last_name);
      setValue('email', JSON.parse(session ?? '').user.email);
    };

    initProfile();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const session = await AsyncStorage.getItem(SUPABASE_STORAGE_KEY);

    //console.log(JSON.parse(session ?? '').user.id);
    const { error, status } = await supabase
      .from('profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
      })
      .eq('id', JSON.parse(session ?? '').user.id);

    setLoading(false);

    if (status == 204) {
      Alert.alert('Success', 'Profile updated');
    }
    if (error) {
      console.log(error);
      Alert.alert('Error', error?.message ?? '');
    }
  };

  return (
    <Box flex={1} bg='white' pt='5' h='full'>
      <StackScreen title='Account settings' headerShown={true} />
      <ScrollView>
        <VStack space='3' px='3'>
          <Controller
            name='firstName'
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.firstName}>
                <FormControl.Label>First name</FormControl.Label>
                <MInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder='Enter first name'
                  type='text'
                />
                <FormControl.ErrorMessage fontSize='xl'>
                  {errors.firstName?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          <Controller
            name='lastName'
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.lastName}>
                <FormControl.Label>Last name</FormControl.Label>
                <MInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder='Enter your last name'
                  type='text'
                />
                <FormControl.ErrorMessage fontSize='xl'>
                  {errors.lastName?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.email}>
                <FormControl.Label>Email</FormControl.Label>
                <MInput
                  autoComplete='email'
                  isDisabled={true}
                  isReadOnly={true}
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
          <MButton
            isLoading={loading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            _text={{ fontSize: 18 }}
            mt='24'
          >
            Update profile
          </MButton>
        </VStack>

        {/*  <VStack>
        <MButton
          mx='2'
          bg='transparent'
          borderWidth={1}
          borderColor='red.400'
          _text={{ color: 'red.400' }}
          onPress={async () => {
            await supabase.auth.signOut();
          }}
        >
          Signout
        </MButton>
      </VStack> */}
      </ScrollView>
    </Box>
  );
}
