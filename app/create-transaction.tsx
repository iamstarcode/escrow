import * as React from 'react';
import {
  Box,
  Button,
  Center,
  Fab,
  Flex,
  FormControl,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import * as yup from 'yup';

import { ScreenProps } from '../types';

import { useEffect, useState } from 'react';
import useAxios from '../hooks/usesAxios';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from './(auth)/provider';

import { Stack, Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import { MButton, MInput, MText } from '../components/ui';

import { EvilIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import StackScreen from '../components/StackScreen';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

export interface IHomeProps extends ScreenProps {}

export default function CreateTransaction({}: IHomeProps) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const { authAxios } = useAxios();

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('First name is required')
      .min(3, 'Name too short'),
    description: yup
      .string()
      .required('Last name is rquired')
      .min(3, 'Name too short'),
    price: yup.number().required().positive(),
    quantity: yup.number().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 1,
      quantity: 1,
    },
    resolver: yupResolver(schema),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    //setUser(null);
    router.replace('/sign-in');
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    /* const session = await AsyncStorage.getItem(SUPABASE_STORAGE_KEY);

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
    } */
  };

  //if (!user) return <SplashScreen />;

  return (
    <Box flex={1} px='3' py='3' bg='white'>
      <StackScreen title='Create Transactions' headerShown={true} />
      <ScrollView>
        <ScrollView>
          <VStack space='3' px='3'>
            <Controller
              name='name'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.name}>
                  <FormControl.Label>First name</FormControl.Label>
                  <MInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='Enter product name'
                    type='text'
                  />
                  <FormControl.ErrorMessage fontSize='xl'>
                    {errors.name?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              name='description'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.description}>
                  <FormControl.Label>Last name</FormControl.Label>
                  <TextArea
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='Enter your product description'
                    autoCompleteType={undefined}
                  />
                  <FormControl.ErrorMessage fontSize='xl'>
                    {errors.description?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name='price'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.price}>
                  <FormControl.Label>Email</FormControl.Label>
                  <MInput
                    autoComplete='email'
                    value={value.toString()}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='Email'
                    keyboardType='numeric'
                  />
                  <FormControl.ErrorMessage fontSize='xl'>
                    {errors.price?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
            />
            <MButton
              onPress={() => router.push('/add-product')}
              _text={{ fontSize: 18 }}
            >
              Add product
            </MButton>
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
      </ScrollView>
    </Box>
  );
}
