import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { HabitCategory } from '../types';
import { HABIT_CATEGORIES, FONT, RADIUS, SPACING, hexToRgba } from '../constants/theme';

interface CategoryPickerProps {
  selectedCategory: HabitCategory;
  onSelectCategory: (category: HabitCategory) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>CATEGORY</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {HABIT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryItem,
                {
                  backgroundColor: isSelected
                    ? hexToRgba(cat.color, 0.12)
                    : colors.surfaceVariant,
                  borderColor: isSelected ? cat.color : 'transparent',
                  borderWidth: isSelected ? 1.5 : 0,
                },
              ]}
              onPress={() => onSelectCategory(cat.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: hexToRgba(cat.color, 0.15) },
                ]}
              >
                <MaterialIcons
                  name={cat.icon as any}
                  size={20}
                  color={cat.color}
                />
              </View>
              <Text
                style={[
                  styles.categoryName,
                  {
                    color: isSelected ? cat.color : colors.textSecondary,
                  },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 13,
    fontFamily: FONT.semibold,
    marginBottom: SPACING.md,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  scrollContent: {
    gap: SPACING.sm,
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    minWidth: 76,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: FONT.medium,
  },
});
