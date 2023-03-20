import React from "react";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Checkbox, HStack, Image, VStack, Text } from "native-base";
import { MText } from "./ui";

import _ from "lodash";
import { formatNumber } from "react-native-currency-input";

export interface IProductItemListProps {
  products: any;
}

export default function ProductItemList({ products }: IProductItemListProps) {
  //console.log("produxt-list", products);

  const [selected, setSelected] = useState<any | []>([]);

  const handelSelection = (isSelected: boolean, index: any) => {
    const selectedX = [...selected, index];

    //const abc =  _.uniq([1,3,5,6,6,6,9,8,8,8,])
    console.log(index);
    const ab = selected.map((item: any, index: number) => {});
    setSelected(selectedX);
    //0 const newItem = selected.filter((item:any, pos:number)=>)
    // console.log("selected", selected);
  };

  return (
    <FlashList
      estimatedItemSize={200}
      estimatedListSize={{ height: 200, width: 200 }}
      data={products}
      contentContainerStyle={{
        padding: 1,
      }}
      renderItem={({ item, index }: any) => {
        console.log("item", item);
        return (
          <HStack space={2}>
            <Image
              key={index}
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
                  {formatNumber(item.price, { delimiter: ",", prefix: "#" })}
                </MText>
              </VStack>
              <Checkbox
                onChange={(isSelected) => handelSelection(isSelected, index)}
                value={""}
              >
                Add
              </Checkbox>
            </HStack>
          </HStack>
        );
      }}
    />
  );
}
