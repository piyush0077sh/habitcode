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
import { HABIT_ICONS, FONT, RADIUS, SPACING, hexToRgba } from '../constants/theme';

interface IconPickerProps {
  selectedIcon: string;
  selectedColor: string;
  onSelectIcon: (icon: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  selectedColor,
  onSelectIcon,
}) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  // Responsive button size: ~5 buttons per row minimum on small phone
  const buttonSize = Math.max(40, (width - SPACING.xl * 2 - SPACING.sm * 4) / 5);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>ICON</Text>
      <View style={styles.iconsGrid}>
        {HABIT_ICONS.map((icon) => {
          const isSelected = selectedIcon === icon;
          return (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconButton,
                {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: RADIUS.md,
                  backgroundColor: isSelected
                    ? hexToRgba(selectedColor, 0.12)
                    : colors.surfaceVariant,
                  borderColor: isSelected ? selectedColor : 'transparent',
                  borderWidth: isSelected ? 1.5 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
              onPress={() => onSelectIcon(icon)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={icon as any}
                size={24}
                color={isSelected ? selectedColor : colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}
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
  iconsGrid: {
    columnGap: SPACING.sm,
  },
  iconButton: {  borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconPicker;
