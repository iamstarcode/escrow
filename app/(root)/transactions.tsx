import {
  Box,
  Button,
  Center,
  Fab,
  Flex,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import * as React from 'react';

import { ScreenProps } from '../../types';
import MButton from '../../components/ui/MButton';

import { useEffect, useState } from 'react';
import useAxios from '../../hooks/usesAxios';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../(auth)/provider';

import { Stack, Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import { MText } from '../../components/ui';

import { EvilIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import StackScreen from '../../components/StackScreen';

export interface IHomeProps extends ScreenProps {}

export default function Second({}: IHomeProps) {
  //const user = useAppSelector(selectUser);
  //const dispatch = useAppDispatch();

  //const { session } = useAuth();

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
    <Box flex={1} px='3' py='3' bg='white'>
      <StackScreen title='Transactions' />
      <ScrollView>
        <VStack space='3'>
          <Pressable
            onPress={() => {
              router.push('/profile');
            }}
          >
            <Box
              borderWidth={2}
              p='2'
              borderColor='warmGray.200'
              borderRadius='xl'
              alignItems='center'
            >
              <HStack>
                <Text flex={1}>Hjj</Text>
                <Text>cdhbh</Text>
              </HStack>
              <HStack>
                <Text flex={1}>Hjj</Text>
                <Text>cdhbh</Text>
              </HStack>
            </Box>
          </Pressable>
        </VStack>
      </ScrollView>
      <Fab
        renderInPortal={false}
        shadow={5}
        size='lg'
        color='primary.300'
        right={170}
        bottom={5}
        onPress={() => router.push('/create-transaction')}
        icon={<Icon color='white' as={AntDesign} name='plus' size='lg' />}
      />
    </Box>
  );
}
