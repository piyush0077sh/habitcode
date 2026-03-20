import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { HABIT_COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  // Calculate responsive button size: assume ~6 buttons per row at minimum on small phone
  const buttonSize = Math.max(36, (width - SPACING.xl * 2 - SPACING.md * 5) / 6);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>COLOR</Text>
      <View style={styles.colorsGrid}>
        {HABIT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              {
                width: buttonSize,
                height: buttonSize,
                borderRadius: RADIUS.md,
                backgroundColor: color,
                alignItems: 'center',
                justifyContent: 'center',
              },
              selectedColor === color && {
                borderWidth: 3,
                borderColor: '#fff',
              },
            ]}
            onPress={() => onSelectColor(color)}
            activeOpacity={0.8}
          >
            {selectedColor === color && (
              <MaterialIcons name="check" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
  },
  label: {
    fontSize: 13,
    fontFamily: FONT.semibold,
    marginBottom: SPACING.md,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  colorsGrid: {
    columnGap: SPACING.md,
  },
  colorButton: {  borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ColorPicker;
