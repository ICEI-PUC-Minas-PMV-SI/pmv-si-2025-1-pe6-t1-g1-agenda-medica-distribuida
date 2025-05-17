import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function FormInput({
  label,
  error,
  touched,
  isPassword,
  showPassword,
  onTogglePassword,
  ...props
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            touched && error && styles.inputError,
            isPassword && { paddingRight: 45 },
          ]}
          placeholderTextColor={COLORS.textSecondary}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={onTogglePassword}
          >
            <FontAwesome
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {touched && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding.medium,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    fontFamily: FONTS.regular,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.error,
    marginTop: 4,
  },
  passwordToggle: {
    position: 'absolute',
    right: SIZES.padding.medium,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
}); 