import { memo, useCallback } from "react";
import { VStack, Image, HStack, Checkbox, Icon } from "native-base";
import { useRouter } from "expo-router";

import { formatNumber } from "react-native-currency-input";
import MButton from "../MButton";
import MText from "../MText";
import { Product } from "../../../types";
import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";

import { AntDesign } from "@expo/vector-icons";
import { ProductResponseSuccess } from "../../../lib/supabase";
export interface IAppProps {
  product: ProductResponseSuccess;
  index: number;
  setProdcuts: any;
}

const SelectedProductItem = memo(
  ({ product, index, setProdcuts }: IAppProps) => {
    const router = useRouter();
    //console.log("item", item);
    const cld = new Cloudinary({
      cloud: {
        cloudName: "escrow",
      },
    });
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
            source={{
              uri: cld.image(product?.images[0]).createCloudinaryURL(),
            }}
            style={{ width: 85, height: 85 }}
          />
          <HStack flex={1} justifyContent="space-between">
            <VStack>
              <MText color="black" fontSize={18} fontWeight="bold">
                {product?.name}
              </MText>
              <MText color="coolGray.500">
                {formatNumber(parseInt(product?.price ?? "0"), {
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
              onPress={() => selectHandler(product?.id)}
            />
          </HStack>
        </HStack>
        <MButton
          borderColor="primary.300"
          borderWidth={1}
          bg="transparent"
          size="sm"
          onPress={() =>
            router.push({
              pathname: "/edit-product",
              params: { productId: product?.id, index },
            })
          }
          leftIcon={
            <Icon
              borderColor="warmGray.200"
              as={AntDesign}
              size={5}
              name="edit"
              color="primary.300"
            />
          }
          _text={{ color: "primary.300" }}
        >
          Edit
        </MButton>
      </VStack>
    );
  }
);

export default SelectedProductItem;
