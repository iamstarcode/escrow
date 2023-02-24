import { Box, Button, Center, Flex, HStack, Text, VStack } from 'native-base';
import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import {
  selectAccessToken,
  selectUser,
  setUser,
} from '../app/features/auth/authSlice';

import { ScreenProps } from '../types';
import MButton from '../components/ui/Button';

import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import useAxios from '../hooks/usesAxios';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../context/AuthContext';
import { supabase, supabaseAnonKey, supabaseUrl } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

export interface IHomeProps extends ScreenProps {}

export default function Home({ navigation }: IHomeProps) {
  //const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const { session } = useAuth();
  const supaabse = useSupabaseClient();

  const accessToken = useAppSelector(selectAccessToken);

  const { authAxios } = useAxios();

  const [token, set] = useState<string | null>('');
  const [me, setMe] = useState('');

  useEffect(() => {
    const refreshToken = async () => {
      const token = await SecureStore.getItemAsync('refreshToken');
      set(token);
    };
    refreshToken();
  }, []);

  //console.log(session);
  return (
    <Box p='3' flex={1}>
      <HStack>
        <Flex justifyContent='space-between'>
          <Text>email</Text>
          <Text>{/* user?.email */}</Text>
        </Flex>

        <Flex justifyContent='space-between'>
          <Text>id</Text>
          <Text>{/* user?.id */}</Text>
        </Flex>
      </HStack>

      <Center>
        <Text mt='2'>{token}</Text>
        <Text mt='2'>{accessToken}</Text>

        <Text pt='16'>{me + ' request at ' + Date.now()}</Text>
        <MButton p='2' onPress={async () => {}}>
          Get Me
        </MButton>
        <MButton
          mt='3'
          p='2'
          onPress={async () => await supaabse.auth.signOut()}
        >
          Log Out
        </MButton>
      </Center>
    </Box>
  );
}
