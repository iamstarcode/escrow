import { Button, Text } from 'native-base';
import {
  IButtonProps,
} from 'native-base/lib/typescript/components/primitives/Button/types';
import React from 'react';

export default function MButton(props: IButtonProps) {
  return (
    <Button
      size='lg'
      bg='primary.300'
      borderRadius='xl'
      p='4'
      _text={{ fontSize: 18, color: 'white' }}
      {...props}
    />
  );
}

export const style: IButtonProps = {
  size: 'lg',
  _text: {
    fontSize: 35,
    color: 'yellow.600',
  },
};
