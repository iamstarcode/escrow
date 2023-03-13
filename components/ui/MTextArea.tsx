import { TextArea } from 'native-base';
import { ITextAreaProps } from 'native-base/lib/typescript/components/primitives/TextArea/index';
import { CurrencyInputProps } from 'react-native-currency-input';
import React from 'react';

export default function MText(props: ITextAreaProps) {
  return (
    <TextArea
      autoCompleteType={undefined}
      p='4'
      _focus={{ bg: 'white' }}
      borderColor='warmGray.200'
      borderRadius='xl'
      bg='white'
      {...props}
    ></TextArea>
  );
}
