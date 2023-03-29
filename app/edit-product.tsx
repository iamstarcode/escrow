import * as React from "react";
import { Image as ImageRN } from "react-native";
import {
  Box,
  FormControl,
  ScrollView,
  VStack,
  Image,
  HStack,
  Center,
  Icon,
  IconButton,
} from "native-base";
import { useRouter, useSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import useSWR, { useSWRConfig } from "swr";

import { FlashList } from "@shopify/flash-list";

import { memo, useCallback, useEffect, useState } from "react";
import useAxios from "../hooks/usesAxios";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { MButton, MInput, MText, MTextArea } from "../components/ui";

import CurrencyInput from "react-native-currency-input";

import * as ImagePicker from "expo-image-picker";

import StackScreen from "../components/StackScreen";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Database } from "../lib/database.types";
import { ProductResponseSuccess, getSingleProduct } from "../lib/supabase";
import { generateRandomString } from "../helpers";
import { SWR_GET_PRODUCT } from "../config/constants";
import Spinner from "../components/Spinner";
const loadingGif = require("../assets/img/image-loading-improved.gif");
import Constants from "expo-constants";
import { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectProduct,
  selectSelected,
  setSelected,
  setSelectedProduct,
} from "../store/features/select/selectedSlice";
import { useBoundStore } from "../store/store";
import { SelectedState } from "../store/productSlice";

const loadingGifURI = ImageRN.resolveAssetSource(loadingGif).uri;

interface Image {
  assetId: string;
  uri: string;
  isSelected: boolean;
  base64: string;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: "escrow",
  },
});

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export default function CreateTransaction() {
  const supabase = useSupabaseClient<Database>();

  const router = useRouter();
  const { mutate } = useSWRConfig();

  const param = useSearchParams(); //
  const productId = param?.productId;

  const updateAProduct = useBoundStore((state) => state.updateAProduct);
  const [product, setProdcut] = useState<undefined | any>(undefined);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any | Image[]>([]);

  const {
    data,
    isLoading: isLoadingProduct,
    mutate: mutateProduct,
  } = useSWR(
    [`${SWR_GET_PRODUCT}/${productId}`, productId, true],
    getSingleProduct
  );

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
      price: "",
      images: 0,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const product = data?.data;
    setProdcut({ ...product });
    setValue("name", product?.name ?? "");
    setValue("description", product?.description ?? "");
    setValue("price", product?.price ?? "", { shouldValidate: true });
    setValue("images", product?.images?.length ?? 0);
  }, [data]);

  //console.log("product", product?.images);

  const removeHandler = useCallback((id: any) => {
    setImages((prev: any) => {
      const filltered = prev.filter((item: any) => !(id === item.assetId));
      setValue("images", filltered.length, { shouldValidate: true });
      return filltered;
    });
  }, []);

  const removeSavedImage = async (index: number) => {
    let length = product?.images?.length ?? 1;
    if (length <= 1) {
      Alert.alert("Error", "You have to have at least one image");
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();

    let deleteURL = `${apiUrl}/cloudinary/delete`;

    setLoading(true);

    const images: any = product?.images ?? [];
    console.log(images);
    const afterDelete = images?.filter(
      (image: any) => image !== product?.images[index]
    );

    console.log(afterDelete);
    let data = {
      publicId: images[index],
    };

    try {
      await fetch(deleteURL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        method: "POST",
      });

      const { data: other } = await supabase
        .from("products")
        .update({
          images: afterDelete,
        })
        .eq("id", product?.id)
        .select("*")
        .single();

      if (other) {
        setProdcut({ ...other });
        setImages([]);
        updateAProduct({ ...other, isSelected: true });
      }
      mutateProduct();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    let imageURIs: any[] = [];
    images.map((image: { uri: any }) => {
      imageURIs.push(image.uri);
    });

    const srcs = await uploadImageToCloudiinary(images);
    const { data: user } = await supabase.auth.getUser();

    try {
      const { data: other } = await supabase
        .from("products")
        .update({
          name: data.name,
          user_id: user.user?.id ?? "",
          description: data.description,
          price: data.price,
          images: [...(product?.images ?? []), ...srcs],
        })
        .eq("id", productId)
        .select("*")
        .single();
      //console.log("other", other);
      if (other) {
        //const inde = parseInt(index?.toString() ?? "");
        //console.log(index);
        setImages([]);
        setProdcut({ ...other });
        updateAProduct({ ...other, isSelected: true });
      }

      Alert.alert("Success", "Poudct updated");
      await mutateProduct();
      //await mutate(SWR_GET_PRODUCT);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "");
    }
    setLoading(false);

    //mutate("get-products");
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    await requestPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //allowsEditing: true,
      //aspect: [4, 3],
      allowsMultipleSelection: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      //setImages(result.assets[0].uri);
      //console.log(result.assets[0].uri);
      //const assets = [...result.assets];
      const imagesMapped = result.assets.map((item: any) => {
        //item.isSelected = true;
        //return item;
        const newItem: Image = {
          assetId: item.assetId,
          uri: item.uri,
          isSelected: true,
          base64: item.base64,
        };
        return newItem;
      });

      setImages(imagesMapped);
      setValue("images", imagesMapped.length, { shouldValidate: true });
    }
  };

  const uploadImageToCloudiinary = async (images: Image[]) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let apiUrl = "https://api.cloudinary.com/v1_1/escrow/image/upload";
    let srcs: any[] = [];

    for (let index = 0; index < images.length; index++) {
      const file = `data:image/jpg;base64,${images[index].base64}`;
      let data = {
        file,
        upload_preset: "products_unsigned",
        public_id: `${user?.id}/${generateRandomString(20)}`,
      };

      try {
        const fetcher = await fetch(apiUrl, {
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        });
        const response = await fetcher.json();
        srcs.push(response.public_id);
      } catch (error) {
        console.log(error);
      }
    }

    return srcs;
  };

  if (isLoadingProduct) return <Spinner accessibilityLabel="Product loading" />;

  return (
    <Box flex={1} px="3" py="3" bg="white">
      <StackScreen title="Edit Product" headerShown={true} />

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

          {/*  <AdvancedImage cldImg={myImage} /> */}
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
                  value={parseInt(value)}
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

          <VStack space={1}>
            <MText>Images</MText>

            <HStack height={110}>
              <FlashList
                estimatedItemSize={5}
                data={product?.images}
                extraData={product?.images}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 2,
                }}
                renderItem={({ item, index }: any) => {
                  // console.log("item", cld.image(item).createCloudinaryURL());
                  return (
                    <Box position="relative">
                      <Image
                        borderRadius="lg"
                        mt={2}
                        mr={2}
                        key={index}
                        alt="image"
                        source={{
                          uri: cld.image(item).createCloudinaryURL(),
                        }}
                        loadingIndicatorSource={{ uri: loadingGifURI }}
                        fallbackSource={{ uri: loadingGifURI }}
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
                        onPress={() => removeSavedImage(index)}
                        icon={
                          <Icon
                            size={4}
                            name="delete"
                            color="white"
                            borderColor="warmGray.200"
                            as={AntDesign}
                          />
                        }
                      />
                    </Box>
                  );
                }}
              />
            </HStack>
          </VStack>
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

          {images?.length > 0 && (
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
                      loadingIndicatorSource={{ uri: loadingGifURI }}
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
          )}

          <MButton
            isLoading={loading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            _text={{ fontSize: 18 }}
            mt="18"
          >
            Update product
          </MButton>
        </VStack>
      </ScrollView>
    </Box>
  );
}
