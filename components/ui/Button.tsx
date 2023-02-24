import { Button, Text } from 'native-base';
import {
  IButtonProps,
  InterfaceButtonProps,
} from 'native-base/lib/typescript/components/primitives/Button/types';
import React from 'react';

export default function MButton(props: IButtonProps) {
  return (
    <Button
      size='lg'
      bg='primary.400'
      p='4'
      _text={{ fontSize: 18 }}
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
