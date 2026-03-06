import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
                  backgroundColor: isSelected
                    ? hexToRgba(selectedColor, 0.12)
                    : colors.surfaceVariant,
                  borderColor: isSelected ? selectedColor : 'transparent',
                  borderWidth: isSelected ? 1.5 : 0,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconPicker;
