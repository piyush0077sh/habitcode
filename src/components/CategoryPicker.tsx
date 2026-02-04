import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { HabitCategory } from '../types';
import { HABIT_CATEGORIES } from '../constants/theme';

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
      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {HABIT_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryItem,
              {
                backgroundColor:
                  selectedCategory === cat.id ? cat.color + '20' : colors.surfaceVariant,
                borderColor: selectedCategory === cat.id ? cat.color : colors.border,
              },
            ]}
            onPress={() => onSelectCategory(cat.id)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: cat.color + '30' },
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
                  color: selectedCategory === cat.id ? cat.color : colors.textSecondary,
                },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollContent: {
    gap: 10,
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    minWidth: 80,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
  },
});
