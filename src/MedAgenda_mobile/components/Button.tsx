import React from 'react';
import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base';

interface Props extends IButtonProps {
  title: string;
  variant?: 'solid' | 'outline';
}

export function Button({ title, variant = 'solid', ...rest }: Props) {
  return (
    <NativeBaseButton
      w="full"
      h={14}
      bg={variant === 'solid' ? 'primary.500' : 'transparent'}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor="primary.500"
      rounded="lg"
      _pressed={{
        bg: variant === 'solid' ? 'primary.600' : 'primary.50',
      }}
      {...rest}
    >
      <Text
        color={variant === 'solid' ? 'white' : 'primary.500'}
        fontFamily="heading"
        fontSize="md"
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
} 