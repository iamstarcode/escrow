import React, { memo, useCallback } from "react";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import {
  Checkbox,
  HStack,
  Image,
  VStack,
  Text,
  View,
  Spinner,
} from "native-base";
import { MText } from "..";
import { Image as ImageRN } from "react-native";

import _ from "lodash";
import { formatNumber } from "react-native-currency-input";
import { Product } from "../../../types";
import { TouchableOpacity } from "react-native";

import { Cloudinary } from "@cloudinary/url-gen";
import { useBoundStore } from "../../../store/store";
import { SelectedState } from "../../../store/productSlice";

const loadingGif = require("../../../assets/img/image-loading-improved.gif");
const loadingGifURI = ImageRN.resolveAssetSource(loadingGif).uri;
export interface IProductItemListProps {
  products?: any;
  setProdcuts?: any;
}

export default function ProductItemList() {
  const products = useBoundStore((state) => state.products);
  const toggleSelected = useBoundStore((state) => state.toggleSelected);
  const selectHandler = useCallback((id: any) => toggleSelected(id), []);

  return (
    <FlashList
      estimatedItemSize={5}
      estimatedListSize={{ height: 200, width: 200 }}
      data={products}
      extraData={products}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item }) => (
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
    const cld = new Cloudinary({
      cloud: {
        cloudName: "escrow",
      },
    });

    return (
      <HStack space={2} py={2}>
        <Image
          key={item.id}
          alt="Image"
          borderRadius="lg"
          source={{ uri: cld.image(item.images[0]).createCloudinaryURL() }}
          loadingIndicatorSource={{
            uri: loadingGifURI,
          }}
          style={{ width: 64, height: 64 }}
        />

        <HStack flex={1} justifyContent="space-between">
          <VStack>
            <MText color="black" fontSize={18} fontWeight="bold">
              {item.name}
            </MText>
            <MText color="coolGray.500">
              {formatNumber(parseInt(item?.price), {
                delimiter: ",",
                prefix: "₦",
              })}
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
