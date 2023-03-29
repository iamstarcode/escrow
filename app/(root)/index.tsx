import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Icon,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import * as React from "react";

import { ScreenProps } from "../../types";
import MButton from "../../components/ui/MButton";

import { useEffect, useState } from "react";
import useAxios from "../../hooks/usesAxios";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAuth } from "../(auth)/provider";

import { Tabs, useRouter, Stack, SplashScreen } from "expo-router";
import { View } from "react-native";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
export interface IHomeProps extends ScreenProps {}

export default function Home({}: IHomeProps) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  //const { session } = useAuth();

  const { authAxios } = useAxios();

  const [token, set] = useState<string | null>("");
  const [me, setMe] = useState("");

  //if (!session?.user) return <SplashScreen />;
  return (
    <Box bg="white" safeArea>
      <Stack.Screen
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <ScrollView>
        <VStack py="5" px="3" bg={"primary.400"} space="4">
          <HStack
            justifyContent="space-between"
            alignItems="baseline"
            bg={"primary.400"}
          >
            <Text color="white" fontWeight="bold" fontSize={18}>
              <Text fontWeight="normal" fontSize="14">
                Hello
              </Text>{" "}
              Bakare Abiola
            </Text>
            <Icon as={AntDesign} name="bells" color="white" />
          </HStack>

          <Text color="white">Account Balance</Text>

          <HStack justifyContent="space-between" alignItems="baseline">
            <Text color="white" fontSize="32">
              #500,000.00
            </Text>
            <Text color="white">reveal icon</Text>
          </HStack>
        </VStack>

        <VStack p="4">
          <Text py="4">Quick Links</Text>
          <HStack px="9" space="12" justifyContent="space-evenly">
            <VStack alignItems="center">
              <Avatar bg="blue.100" size="lg">
                <Icon
                  as={MaterialIcons}
                  name="event-note"
                  size="3xl"
                  color="blue.400"
                />
              </Avatar>
              <Text>Create</Text>
            </VStack>
            <VStack alignItems="center">
              <Avatar bg="blue.100" size="lg">
                <Icon
                  as={MaterialIcons}
                  name="event-note"
                  size="3xl"
                  color="blue.400"
                />
              </Avatar>
              <Text>Create</Text>
            </VStack>
            <VStack alignItems="center">
              <Avatar bg="blue.100" size="lg">
                <Icon
                  as={MaterialIcons}
                  name="event-note"
                  size="3xl"
                  color="blue.400"
                />
              </Avatar>
              <Text>Create</Text>
            </VStack>
          </HStack>

          {/* First Box */}
          <Box borderWidth="1" p="3" mt="3">
            <HStack justifyContent="space-evenly">
              <HStack space="2" alignItems="center">
                <Avatar
                  p="4"
                  bg="coolGray.100"
                  size="lg"
                  borderColor="coolGray.200"
                  borderWidth={2}
                >
                  <Icon
                    as={MaterialIcons}
                    name="event-note"
                    size="3xl"
                    color="primary.300"
                  />
                </Avatar>
                <VStack>
                  <Text>Disis</Text>
                  <Text>Disis</Text>
                </VStack>
              </HStack>
              <Divider orientation="vertical" mx="3" />
              <HStack space="2" alignItems="center">
                <Avatar
                  p="4"
                  bg="coolGray.100"
                  size="lg"
                  borderColor="coolGray.200"
                  borderWidth={2}
                >
                  <Icon
                    as={MaterialIcons}
                    name="event-note"
                    size="3xl"
                    color="primary.300"
                  />
                </Avatar>
                <VStack>
                  <Text>Disis</Text>
                  <Text>Disis</Text>
                </VStack>
              </HStack>
            </HStack>
          </Box>

          {/* Second Box */}
          <Box borderWidth="1" p="3" mt="3">
            <HStack justifyContent="space-evenly">
              <HStack space="2" alignItems="center">
                <Avatar
                  p="4"
                  bg="coolGray.100"
                  size="lg"
                  borderColor="coolGray.200"
                  borderWidth={2}
                >
                  <Icon
                    as={MaterialIcons}
                    name="event-note"
                    size="3xl"
                    color="primary.300"
                  />
                </Avatar>
                <VStack>
                  <Text>Disis</Text>
                  <Text>Disis</Text>
                </VStack>
              </HStack>
              <Divider orientation="vertical" mx="3" />
              <HStack space="2" alignItems="center">
                <Avatar
                  p="4"
                  bg="coolGray.100"
                  size="lg"
                  borderColor="coolGray.200"
                  borderWidth={2}
                >
                  <Icon
                    as={MaterialIcons}
                    name="event-note"
                    size="3xl"
                    color="primary.300"
                  />
                </Avatar>
                <VStack>
                  <Text>Disis</Text>
                  <Text>Disis</Text>
                </VStack>
              </HStack>
            </HStack>
          </Box>

          <HStack justifyContent="space-between" mt="2">
            <Text>Recent Transactions</Text>
            <Text>See all</Text>
          </HStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
