import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { HABIT_COLORS } from '../constants/theme';

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
      <Text style={[styles.label, { color: colors.text }]}>Color</Text>
      <View style={styles.colorsGrid}>
        {HABIT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { 
                backgroundColor: color,
                shadowColor: color,
              },
              selectedColor === color && styles.selectedColor,
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
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedColor: {
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default ColorPicker;
