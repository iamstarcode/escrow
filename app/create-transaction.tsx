import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Center,
  FormControl,
  HStack,
  IconButton,
  Modal,
  ScrollView,
  TextArea,
  Image,
  VStack,
  Checkbox,
} from "native-base";
import { SplashScreen, useRouter } from "expo-router";
import { Fontisto, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import * as yup from "yup";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { MButton, MInput, MText } from "../components/ui";

import {
  ProductItemList,
  SelectedProductItem,
} from "../components/ui/products";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import CurrencyInput, { formatNumber } from "react-native-currency-input";

import StackScreen from "../components/StackScreen";
import { Product } from "../types";

export default function CreateTransaction() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [products, setProdcuts] = useState<any | Product[]>([]);

  const [modalVisible, setModalVisible] = React.useState(false);

  const [selected, setSelected] = useState([]);

  //gfbjfgfg
  useEffect(() => {
    supabase
      .from("products")
      .select()
      .then(({ data }) => {
        const mappedProdcuts = data?.map((item) => {
          item.isSelected = false;
          return item;
        });
        setProdcuts(mappedProdcuts);
      });
  }, []);

  useEffect(() => {
    const selected = products.filter((item: Product) => item.isSelected);
    setSelected(selected);

    console.log(selected.length);
  }, [products]);

  const schema = yup.object().shape({
    transactionName: yup
      .string()
      .required("Transantion name is required")
      .min(3, "Transantion name is too short"),
    amountPayable: yup.number().required().positive().typeError(""),
    deliveryDate: yup.date().required(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      transactionName: "",
      deliveryDate: new Date(),
      amountPayable: 0,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);

    setLoading(false);
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    //setDate(currentDate);
    setValue("deliveryDate", currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  //console.log(selected);
  if (!products) return <SplashScreen />;
  return (
    <Box flex={1} px="3" py="3" bg="white">
      <StackScreen title="Create Transactions" headerShown={true} />
      <ScrollView>
        <VStack space="3" px="3">
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

          <Box
            borderRadius="lg"
            borderWidth="2"
            p={3}
            borderColor={selected.length > 0 ? "warmGray.200" : "red.100"}
          >
            {selected.length <= 0 ? (
              <Center p="8">
                <IconButton
                  size="lg"
                  _icon={{
                    as: AntDesign,
                    name: "pluscircleo",
                  }}
                  onPress={() => setModalVisible(true)}
                />
                <MText>Select Product(s)</MText>
              </Center>
            ) : (
              selected.map((item: any) => (
                <SelectedProductItem
                  item={item}
                  products={products}
                  setProdcuts={setProdcuts}
                />
              ))
            )}
          </Box>

          <MButton
            onPress={() => router.push("/add-product")}
            _text={{ fontSize: 18 }}
          >
            Add new product
          </MButton>
          <MButton
            isLoading={loading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            _text={{ fontSize: 18 }}
            mt="24"
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
                  <ProductItemList
                    products={products}
                    setSelected={setSelected}
                    setProdcuts={setProdcuts}
                  />
                </Box>
              </Modal.Body>
              <Modal.Footer>
                <HStack space={2}>
                  <MButton
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    Cancel
                  </MButton>
                  <MButton
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    Save
                  </MButton>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </ScrollView>
    </Box>
  );
}
