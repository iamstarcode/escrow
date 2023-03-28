import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Center,
  FormControl,
  HStack,
  Modal,
  ScrollView,
  TextArea,
  Image,
  VStack,
  Checkbox,
  IconButton,
  Icon,
} from "native-base";
import { SplashScreen, useRouter } from "expo-router";
import {
  Fontisto,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
import { Database } from "../lib/database.types";
import { ProductResponseSuccess, getProducts } from "../lib/supabase";
import useSWR from "swr";
import Spinner from "../components/Spinner";
import { SWR_GET_PRODUCTS } from "../config/constants";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectSelected,
  setSelectedProduct,
  setSelected as setRedux,
} from "../store/features/select/selectedSlice";
import { Cloudinary } from "@cloudinary/url-gen";
import { useBoundStore } from "../store/store";

export default function CreateTransaction() {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxSelected = useAppSelector(selectSelected);
  //const

  const product = useBoundStore((state) => state.products);
  //const setProdcutsZ = useSelectedStore((state) => state.setProducts);
  //const productsz = useSelectedStore((state) => state.products);

  /*  useEffect(() => {
    console.log("products", productsz);
  }, [productsz]); */

  const cld = new Cloudinary({
    cloud: {
      cloudName: "escrow",
    },
  });

  useEffect(() => {
    console.log(
      "selected",
      cld.image(reduxSelected[0]?.images[1]).createCloudinaryURL()
    );
  }, [reduxSelected]);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [products, setProdcuts] = useState<any | Product[]>([]);

  const [modalVisible, setModalVisible] = React.useState(false);

  const [selected, setSelected] = useState<Product[]>([]);

  const { data, isLoading: isLoadingProducts } = useSWR(
    SWR_GET_PRODUCTS,
    getProducts
  );

  useEffect(() => {
    const mapped = data?.data?.map((product: any) => {
      product.isSelected = false;
      return product;
    });

    //setProdcutsZ(mapped);
    setProdcuts(mapped);
  }, [data]);

  useEffect(() => {
    const selected = products?.filter((item: Product) => item.isSelected);

    dispatch(setRedux(selected));

    setSelected(selected);
  }, [products]);

  useEffect(() => {
    let totalPayable = 0;
    reduxSelected?.map((item: any) => {
      totalPayable += parseInt(item.price);
    });
    setValue("amountPayable", totalPayable);
  }, [reduxSelected]);

  useEffect(() => {
    console.log("check");
  }, []);
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
    //console.log(data);
    setLoading(true);

    const { data: user } = await supabase.auth.getUser();

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

  const dummy = () => {
    dispatch(
      setSelectedProduct(
        {
          can_edit: true,
          description: "Nrwdiidii",
          id: 6,
          images: [
            "products/d9c444f1-4e91-4abb-b4c7-1d18318990e9/6fPdV6VQpJ4gxvyAIdiz",
          ],
          isSelected: true,
          name: "iPhone X 64 gb s",
          price: "125000",
          user_id: "d9c444f1-4e91-4abb-b4c7-1d18318990e9",
        },
        0
      )
    );
  };
  if (isLoadingProducts)
    return <Spinner accessibilityLabel="Products loading" />;

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

          <Box p={0}>
            {reduxSelected?.length > 0 ? (
              <VStack space={3}>
                {reduxSelected &&
                  reduxSelected.map(
                    (product: ProductResponseSuccess, index: number) => (
                      <SelectedProductItem
                        key={product?.id}
                        product={product}
                        index={index}
                        setProdcuts={setProdcuts}
                      />
                    )
                  )}
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

          <MButton onPress={() => dummy()} _text={{ fontSize: 18 }} mt="18">
            Mutate
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
                    setProdcuts={setProdcuts}
                  />
                </Box>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </VStack>
      </ScrollView>
    </Box>
  );
}
