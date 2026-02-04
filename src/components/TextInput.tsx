import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface TextInputProps extends RNTextInputProps {
  label: string;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <RNTextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceVariant,
            color: colors.text,
            borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
            borderWidth: isFocused ? 2 : 1,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary + '90'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  input: {
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
});

export default TextInput;
