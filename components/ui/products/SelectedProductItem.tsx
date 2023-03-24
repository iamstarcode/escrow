import { VStack, Image, HStack, Checkbox, Icon } from "native-base";
import { memo, useCallback } from "react";

import { formatNumber } from "react-native-currency-input";
import MButton from "../MButton";
import MText from "../MText";
import { Product } from "../../../types";
import React from "react";

import { AntDesign } from "@expo/vector-icons";
export interface IAppProps {
  item: Product;
  setProdcuts: any;
  products: any;
}

/* export default function SelectedProductItem({
  item,
  products,
  setProdcuts,
}: IAppProps) {
  const selectHandler = useCallback((id: any) => {
    setProdcuts((prev: any[]) => {
      return prev.map((item: Product) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      );
    });
  }, []);
  return (
    <VStack
      p="3"
      space={3}
      borderRadius="lg"
      borderWidth={1}
      borderColor="warmGray.200"
    >
      <HStack space={2}>
        <Image
          alt="Image"
          borderRadius="lg"
          source={{ uri: item.images[0].uri }}
          style={{ width: 85, height: 85 }}
        />
        <HStack flex={1} justifyContent="space-between">
          <VStack>
            <MText color="black" fontSize={18} fontWeight="bold">
              {item.name}
            </MText>
            <MText color="coolGray.500">
              {formatNumber(item.price, {
                delimiter: ",",
                prefix: "#",
              })}
            </MText>
          </VStack>
          <Icon
            borderColor="warmGray.200"
            as={AntDesign}
            size={5}
            name="closecircleo"
            color="danger.500"
            onPress={() => selectHandler(item.id)}
          />
        </HStack>
      </HStack>
      <MButton
        borderColor="primary.300"
        borderWidth={1}
        bg="transparent"
        size="sm"
        leftIcon={
          <Icon
            borderColor="warmGray.200"
            as={AntDesign}
            size={5}
            name="edit"
            color="primary.300"
            onPress={() => selectHandler(item.id)}
          />
        }
        _text={{ color: "primary.300" }}
      >
        Edit
      </MButton>
    </VStack>
  );
} */
const SelectedProductItem = memo(({ item, setProdcuts }: IAppProps) => {
  const selectHandler = useCallback((id: any) => {
    setProdcuts((prev: any[]) => {
      return prev.map((item: Product) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      );
    });
  }, []);
  return (
    <VStack
      p="3"
      space={3}
      borderRadius="lg"
      borderWidth={1}
      borderColor="warmGray.200"
    >
      <HStack space={2}>
        <Image
          alt="Image"
          borderRadius="lg"
          source={{ uri: item.images[0].uri }}
          style={{ width: 85, height: 85 }}
        />
        <HStack flex={1} justifyContent="space-between">
          <VStack>
            <MText color="black" fontSize={18} fontWeight="bold">
              {item.name}
            </MText>
            <MText color="coolGray.500">
              {formatNumber(item.price, {
                delimiter: ",",
                prefix: "₦",
              })}
            </MText>
          </VStack>
          <Icon
            borderColor="warmGray.200"
            as={AntDesign}
            size={5}
            name="closecircleo"
            color="danger.500"
            onPress={() => selectHandler(item.id)}
          />
        </HStack>
      </HStack>
      <MButton
        borderColor="primary.300"
        borderWidth={1}
        bg="transparent"
        size="sm"
        leftIcon={
          <Icon
            borderColor="warmGray.200"
            as={AntDesign}
            size={5}
            name="edit"
            color="primary.300"
            onPress={() => selectHandler(item.id)}
          />
        }
        _text={{ color: "primary.300" }}
      >
        Edit
      </MButton>
    </VStack>
  );
});

export default SelectedProductItem;
