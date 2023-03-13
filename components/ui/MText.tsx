import { Text } from 'native-base';
import { InterfaceTextProps } from 'native-base/lib/typescript/components/primitives/Text/types';
import React from 'react';

export default function MText(props: InterfaceTextProps) {
  return <Text color='primary.300' {...props}></Text>;
}
