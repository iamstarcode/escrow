import React, { memo, useCallback } from "react";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Checkbox, HStack, Image, VStack, Text, View } from "native-base";
import { MText } from "..";

import _ from "lodash";
import { formatNumber } from "react-native-currency-input";
import { Product } from "../../../types";
import { TouchableOpacity } from "react-native";

export interface IProductItemListProps {
  products: any;
  setProdcuts: any;
}

export default function ProductItemList({
  products,
  setProdcuts,
}: IProductItemListProps) {
  const selectHandler = useCallback((id: any) => {
    setProdcuts((prev: any[]) => {
      return prev.map((item: Product) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      );
    });
  }, []);

  return (
    <FlashList
      estimatedItemSize={5}
      estimatedListSize={{ height: 200, width: 200 }}
      data={products}
      extraData={products}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item }: any) => (
        <Item item={item} onCheckHandler={selectHandler} />
      )}
    />
  );
}

const Item = memo(
  ({
    item,
    onCheckHandler,
  }: {
    item: Product;
    onCheckHandler: (id: any) => void;
  }) => {
    return (
      <HStack space={2} py={2}>
        <Image
          key={item.id}
          alt="Image"
          borderRadius="lg"
          source={{ uri: item.images[0].uri }}
          style={{ width: 64, height: 64 }}
        />
        <HStack flex={1} justifyContent="space-between">
          <VStack>
            <MText color="black" fontSize={18} fontWeight="bold">
              {item.name}
            </MText>
            <MText color="coolGray.500">
              {formatNumber(item.price, { delimiter: ",", prefix: "₦" })}
            </MText>
          </VStack>
          <Checkbox
            onChange={() => onCheckHandler(item.id)}
            isChecked={item.isSelected}
            value={""}
            aria-label="is-selected"
          />
        </HStack>
      </HStack>
    );
  }
);
