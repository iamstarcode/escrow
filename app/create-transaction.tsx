import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Center,
  FormControl,
  HStack,
  Modal,
  ScrollView,
  VStack,
  IconButton,
  Icon,
  Pressable,
} from "native-base";
import { useRouter } from "expo-router";
import {
  Fontisto,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import * as yup from "yup";

import { debounce } from "lodash";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { MButton, MInput, MText } from "../components/ui";

import {
  ProductItemList,
  SelectedProductItem,
} from "../components/ui/products";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import CurrencyInput from "react-native-currency-input";

import StackScreen from "../components/StackScreen";
import { Database } from "../lib/database.types";
import { getProducts, getProfileByUsername } from "../lib/supabase";
import useSWR from "swr";
import Spinner from "../components/Spinner";
import {
  SWR_GET_PRODUCTS,
  SWR_GET_PROFILE_BY_USERNAME,
} from "../config/constants";
import { useBoundStore } from "../store/store";
import { SelectedState } from "../store/productSlice";

export default function CreateTransaction() {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();
  //const dispatch = useAppDispatch();
  //const reduxSelected = useAppSelector(selectSelected);
  //const

  const products = useBoundStore((state) => state.products);
  const selected = useBoundStore((state) => state.selected);
  const setProducts = useBoundStore((state) => state.setProducts);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUserName] = useState<undefined | string>("");

  const [modalVisible, setModalVisible] = React.useState(false);

  const { data, isLoading: isLoadingProducts } = useSWR(
    SWR_GET_PRODUCTS,
    getProducts
  );

  useEffect(() => {
    const mapped = data?.data?.map((product: any) => {
      product.isSelected = false;
      return product;
    });
    setProducts(mapped);
  }, [data]);

  useEffect(() => {
    let totalPayable = 0;
    selected?.map((item: any) => {
      totalPayable += parseInt(item.price);
    });
    setValue("amountPayable", totalPayable);
  }, [selected]);

  const schema = yup.object().shape({
    transactionName: yup
      .string()
      .required("Transantion name is required")
      .min(3, "Transantion name is too short"),
    amountPayable: yup.number().required().positive().typeError(""),
    username: yup
      .string()
      .required("Please enter username")
      .min(5, "Username too short"),
    deliveryDate: yup.date().required(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      transactionName: "",
      username: "",
      deliveryDate: new Date(),
      amountPayable: 0,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const { data: user } = await supabase.auth.getUser();

    const b = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.user?.id);
    //.then((res) => res);

    console.log("user", b);
    //console.log(data, selected[0].id);
    setLoading(true);

    const products = selected.map((item) => item.id);
    console.log(products);
    //get a user using it's username
    //console.log(products[0].id);
    /*  const { data: res } = supabase.from("transactions").insert({
      seller_id: user.user?.id,
      buyer_id: buyer.id
    }); */

    setLoading(false);
  };

  const onDateChange = (_: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setValue("deliveryDate", currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const {
    data: buyer,
    isLoading: userIsLoading,
    mutate,
  } = useSWR(
    getValues("username").length >= 5
      ? [
          `${SWR_GET_PROFILE_BY_USERNAME}${getValues("username")}`,
          getValues("username"),
        ]
      : null,
    getProfileByUsername
  );

  const handleBuyerChange = (text: string) => {
    setValue("username", text.trim());
    trigger("username");
    userSearch();
  };

  const userSearch = useCallback(
    debounce(() => {
      mutate();
    }, 600),
    []
  );

  useEffect(() => {
    if (buyer?.data?.id) {
      setUserName(`${buyer.data?.first_name} ${buyer.data?.last_name}`);
    } else {
      setUserName(undefined);
    }
  }, [buyer]);

  if (isLoadingProducts)
    return <Spinner accessibilityLabel="Products loading" />;

  return (
    <Box flex={1} px="3" py="3" bg="white">
      <StackScreen title="Create Transactions" headerShown={true} />
      <ScrollView>
        <VStack space="3" px="3">
          <Controller
            name="username"
            control={control}
            render={({
              field: { onBlur, value },
              fieldState: { invalid, error },
            }) => (
              <FormControl isInvalid={invalid}>
                <FormControl.Label>Buyer username</FormControl.Label>
                <MInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={handleBuyerChange}
                  placeholder="Enter username"
                  type="text"
                  rightElement={
                    userIsLoading ? (
                      <Box w="5" p="4">
                        <Spinner size="sm" />
                      </Box>
                    ) : (
                      <MText pr="2">
                        {username ? username : "No user found"}
                      </MText>
                    )
                  }
                />
                <FormControl.ErrorMessage fontSize="xl">
                  {error?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="transactionName"
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { invalid, error },
            }) => (
              <FormControl isInvalid={invalid}>
                <FormControl.Label>Transaction name</FormControl.Label>
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
            name="deliveryDate"
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { invalid, error },
            }) => (
              <FormControl isInvalid={invalid}>
                <FormControl.Label>Delivery Date</FormControl.Label>
                <HStack space={3}>
                  <MInput
                    flex={1}
                    value={value.toDateString()}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your product description"
                  />
                  <IconButton
                    size="lg"
                    onPress={showDatepicker}
                    _icon={{
                      as: Fontisto,
                      name: "date",
                    }}
                  />
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={getValues("deliveryDate")}
                      mode="date"
                      is24Hour={true}
                      minimumDate={new Date()}
                      onChange={onDateChange}
                    />
                  )}
                </HStack>

                <FormControl.ErrorMessage fontSize="xl">
                  {error?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="amountPayable"
            control={control}
            render={({
              field: { onBlur, onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FormControl isInvalid={invalid}>
                <FormControl.Label>Amount Payable</FormControl.Label>
                <CurrencyInput
                  value={value}
                  onChangeValue={(e: any) => setValue("amountPayable", e ?? "")}
                  onChange={onChange}
                  onBlur={onBlur}
                  delimiter=","
                  prefix="₦"
                  precision={0}
                  minValue={0}
                  editable={false}
                  placeholder="Enter price"
                  style={{
                    padding: 16,
                    borderColor: "#e7e5e4",
                    borderWidth: 1,
                    borderRadius: 12,
                    backgroundColor: "#ffffff",
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "black",
                  }}
                />
                <FormControl.ErrorMessage fontSize="xl">
                  {error?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          <Pressable onPress={() => setModalVisible(true)}>
            <HStack space={1} alignItems="center">
              <IconButton
                size="md"
                p={1}
                _icon={{
                  as: MaterialCommunityIcons,
                  name: "selection",
                }}
              />
              <MText>SHOW PRODUCTS</MText>
            </HStack>
          </Pressable>
          <Box p={0}>
            {selected?.length > 0 ? (
              <VStack space={3}>
                {selected &&
                  selected.map((product: SelectedState, index: number) => (
                    <SelectedProductItem
                      key={product?.id}
                      product={product}
                      index={index}
                    />
                  ))}
              </VStack>
            ) : (
              <Center
                borderColor={selected?.length > 0 ? "warmGray.200" : "red.100"}
                borderRadius="lg"
                borderWidth="2"
                p="8"
              >
                <IconButton
                  size="lg"
                  _icon={{
                    as: MaterialCommunityIcons,
                    name: "selection",
                  }}
                  onPress={() => setModalVisible(true)}
                />
                <MText>
                  {products?.length > 0 ? "Select Product(s)" : "No Product(s)"}
                </MText>
              </Center>
            )}
          </Box>

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
                />
              }
            ></IconButton>
            <MText>ADD NEW PRODUCT</MText>
          </Center>

          <MButton
            isLoading={loading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            _text={{ fontSize: 18 }}
            mt="18"
          >
            Create Transaction
          </MButton>

          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            size="full"
            animationPreset="slide"
          >
            <Modal.Content maxH="500" bottom="0" marginTop="auto">
              <Modal.CloseButton />
              <Modal.Header>Select Products</Modal.Header>
              <Modal.Body>
                <Box flex={1}>
                  <ProductItemList />
                </Box>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </VStack>
      </ScrollView>
    </Box>
  );
}
