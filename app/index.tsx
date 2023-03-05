import { Box, Button, Center, Flex, HStack, Text, VStack } from 'native-base';
import * as React from 'react';

import { ScreenProps } from '../types';
import MButton from '../components/ui/Button';

import { useEffect, useState } from 'react';
import useAxios from '../hooks/usesAxios';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from './(auth)/provider';

import { SplashScreen, useRouter } from 'expo-router';

export interface IHomeProps extends ScreenProps {}

export default function Home({}: IHomeProps) {
  //const user = useAppSelector(selectUser);
  //const dispatch = useAppDispatch();

  //const { session } = useAuth();
  const { setUser, user } = useAuth();

  const supabase = useSupabaseClient();
  const router = useRouter();

  const { authAxios } = useAxios();

  const [token, set] = useState<string | null>('');
  const [me, setMe] = useState('');

  const signOut = async () => {
    await supabase.auth.signOut();
    //setUser(null);
    router.replace('/sign-in');
  };

  //if (!user) return <SplashScreen />;
  return (
    <Box p='3' flex={1} safeArea>
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

        <Text pt='16'>{me + ' request at ' + Date.now()}</Text>
        <MButton p='2' onPress={async () => {}}>
          Get Me
        </MButton>
        <MButton mt='3' p='2' onPress={signOut}>
          Log Out
        </MButton>

        <MButton
          mt='3'
          p='2'
          onPress={() => {
            router.push('/change-password');
          }}
        >
          Change password
        </MButton>

        <MButton
          mt='3'
          p='2'
          onPress={async () => {
            await supabase.auth.refreshSession();
          }}
        >
          Fefresh session
        </MButton>
      </Center>
    </Box>
  );
}
