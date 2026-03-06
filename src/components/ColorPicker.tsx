import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>COLOR</Text>
      <View style={styles.colorsGrid}>
        {HABIT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color },
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ColorPicker;
