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
import { HABIT_ICONS } from '../constants/theme';

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
      <Text style={[styles.label, { color: colors.text }]}>Icon</Text>
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
                    ? selectedColor + '18'
                    : colors.surfaceVariant,
                  borderColor: isSelected ? selectedColor : 'transparent',
                  shadowColor: isSelected ? selectedColor : 'transparent',
                  shadowOpacity: isSelected ? 0.3 : 0,
                },
              ]}
              onPress={() => onSelectIcon(icon)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={icon as any}
                size={26}
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
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
});

export default IconPicker;
