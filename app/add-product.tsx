import * as React from "react";
import {
  Box,
  FormControl,
  ScrollView,
  TextArea,
  Text,
  VStack,
  Image,
  Input,
  HStack,
  Center,
  Icon,
  IconButton,
  View,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";

import { ScreenProps } from "../types";

import { FlashList } from "@shopify/flash-list";

import { memo, useCallback, useState } from "react";
import useAxios from "../hooks/usesAxios";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useRouter } from "expo-router";
import { MButton, MInput, MText, MTextArea } from "../components/ui";

import CurrencyInput, { formatNumber } from "react-native-currency-input";

import * as ImagePicker from "expo-image-picker";

import StackScreen from "../components/StackScreen";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Database } from "../lib/database.types";

export interface IHomeProps extends ScreenProps {}

export default function CreateTransaction({}: IHomeProps) {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const { authAxios } = useAxios();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any>([]);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("Product name is required")
      .min(3, "Name too short"),
    description: yup
      .string()
      .required("Please give detailed description of the product")
      .min(3, "Description too short"),
    price: yup
      .number()
      .required("Please enter a price")
      .moreThan(5, "value too small")
      .typeError(""),
    images: yup.number().moreThan(0, "Please select at least one image"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: null,
      images: 0,
    },
    resolver: yupResolver(schema),
  });

  const removeHandler = useCallback((id: any) => {
    setImages((prev: any) => {
      return prev.filter((item: any) => !(id === item.assetId));
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    //setUser(null);
    router.replace("/sign-in");
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { data: user } = await supabase.auth.getUser();
    const { error, status } = await supabase.from("products").insert({
      name: data.name,
      user_id: user.user?.id ?? "",
      description: data.description,
      price: data.price,
      images,
    });

    setLoading(false);

    if (status == 204) {
      Alert.alert("Success", "Profile updated");
    }
    if (error) {
      console.log(error);
      Alert.alert("Error", error?.message ?? "");
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    await requestPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //allowsEditing: true,
      //aspect: [4, 3],
      allowsMultipleSelection: true,

      quality: 1,
    });

    if (!result.canceled) {
      //setImages(result.assets[0].uri);
      console.log(result.assets);
      //const assets = [...result.assets];
      const imagesMapped = result.assets.map((item: any) => {
        item.isSelected = true;
        return item;
      });

      setImages(imagesMapped);
      setValue("images", imagesMapped.length);
    }
  };

  console.log(images.length, getValues("images"));

  //if (!user) return <SplashScreen />;

  const Item = memo(({ id }: { id: number }) => {
    return (
      <FlashList
        estimatedItemSize={100}
        data={images}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          padding: 2,
        }}
        renderItem={({ item, index }: any) => (
          <Image
            borderRadius="lg"
            margin={2}
            key={index}
            alt="image"
            source={{ uri: item.uri }}
            style={{ width: 100, height: 100 }}
          />
        )}
      />
    );
  });
  return (
    <Box flex={1} px="3" py="3" bg="white">
      <StackScreen title="Add Product" headerShown={true} />

      <ScrollView>
        <VStack space="3" px="3">
          <Controller
            name="name"
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { invalid, error },
            }) => (
              <FormControl isInvalid={invalid}>
                <FormControl.Label>Product name</FormControl.Label>
                <MInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter product name"
                  type="text"
                />
                <FormControl.ErrorMessage fontSize="xl">
                  {error?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { invalid, error },
            }) => (
              <FormControl isInvalid={invalid}>
                <FormControl.Label>Description</FormControl.Label>
                <MTextArea
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter your product description"
                />
                <FormControl.ErrorMessage fontSize="xl">
                  {error?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({
              field: { onBlur, onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FormControl isInvalid={invalid}>
                <FormControl.Label>Price</FormControl.Label>
                <CurrencyInput
                  value={value}
                  onChangeValue={(e: any) => setValue("price", e ?? "")}
                  onChange={onChange}
                  onBlur={onBlur}
                  delimiter=","
                  prefix="#"
                  precision={0}
                  minValue={0}
                  placeholder="Enter price"
                  style={{
                    padding: 16,
                    borderColor: "#e7e5e4",
                    borderWidth: 1,
                    borderRadius: 12,
                    backgroundColor: "#ffffff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                />
                <FormControl.ErrorMessage fontSize="xl">
                  {error?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          {images.length <= 0 && (
            <Box
              p="3"
              borderStyle="dashed"
              borderRadius="lg"
              borderWidth={2}
              borderColor="primary.300"
            >
              <Center>
                <IconButton
                  onPress={() => router.push("/add-product")}
                  icon={
                    <Icon
                      borderColor="warmGray.200"
                      as={AntDesign}
                      size={10}
                      name="pluscircle"
                      color="primary.300"
                      onPress={pickImage}
                    />
                  }
                ></IconButton>
                <MText>SELECT IMAGES</MText>
              </Center>
            </Box>
          )}

          <HStack height={110}>
            <FlashList
              estimatedItemSize={5}
              data={images}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 2,
              }}
              renderItem={({ item, index }: any) => (
                <Box position="relative">
                  <Image
                    borderRadius="lg"
                    margin={2}
                    key={index}
                    alt="image"
                    source={{ uri: item.uri }}
                    height={100}
                    width={100}
                  />
                  <IconButton
                    position="absolute"
                    right="0"
                    top="0"
                    borderRadius="full"
                    p="1"
                    bg="danger.500"
                    icon={
                      <Icon
                        size={4}
                        name="close"
                        color="white"
                        borderColor="warmGray.200"
                        as={AntDesign}
                        onPress={() => removeHandler(item.assetId)}
                      />
                    }
                  />
                </Box>
              )}
            />
          </HStack>

          {/*          <MButton onPress={pickImage}>dbcec</MButton> */}
          <MButton
            isLoading={loading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            _text={{ fontSize: 18 }}
            mt="18"
          >
            Add product
          </MButton>
        </VStack>
      </ScrollView>
    </Box>
  );
}
