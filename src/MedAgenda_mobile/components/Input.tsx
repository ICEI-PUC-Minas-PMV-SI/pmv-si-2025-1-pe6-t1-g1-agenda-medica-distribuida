import React from 'react';
import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base';

interface Props extends IInputProps {
  errorMessage?: string;
  label?: string;
}

export function Input({ errorMessage, label, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      {label && (
        <FormControl.Label _text={{ color: 'secondary.700', fontSize: 'sm' }}>
          {label}
        </FormControl.Label>
      )}
      <NativeBaseInput
        bg="white"
        h={14}
        px={4}
        borderWidth={1}
        fontSize="md"
        color="secondary.700"
        fontFamily="body"
        placeholderTextColor="secondary.300"
        isInvalid={invalid}
        _invalid={{
          borderColor: 'error.500',
          borderWidth: 2,
        }}
        _focus={{
          bg: 'white',
          borderColor: 'primary.500',
          borderWidth: 2,
        }}
        {...rest}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
} 