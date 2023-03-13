import { IInputProps } from 'native-base/lib/typescript/components/primitives/Input/types';
import { Input } from 'native-base';
import React from 'react';

export default function MInput(props: IInputProps) {
  return (
    <Input
      size='md'
      p='4'
      _focus={{ bg: 'white' }}
      borderColor='warmGray.200'
      borderRadius='xl'
      bg='white'
      {...props}
    />
  );
}
