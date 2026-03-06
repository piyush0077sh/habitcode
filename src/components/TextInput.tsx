import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONT, RADIUS, SPACING } from '../constants/theme';

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
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <RNTextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceVariant,
            color: colors.text,
            borderColor: error ? colors.error : isFocused ? colors.primary : 'transparent',
            borderWidth: 1,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
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
    marginVertical: SPACING.sm,
  },
  label: {
    fontSize: 13,
    fontFamily: FONT.semibold,
    marginBottom: SPACING.sm,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  input: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    fontSize: 15,
    fontFamily: FONT.regular,
  },
  error: {
    fontSize: 13,
    fontFamily: FONT.medium,
    marginTop: SPACING.xs,
  },
});

export default TextInput;
