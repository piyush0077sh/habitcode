import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { HabitCategory } from '../types';
import { HABIT_CATEGORIES } from '../constants/theme';

interface CategoryFilterProps {
  selectedCategory: HabitCategory | 'all';
  onSelectCategory: (category: HabitCategory | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All Categories Option */}
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor:
                selectedCategory === 'all' ? colors.primary : colors.surfaceVariant,
              borderColor: selectedCategory === 'all' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => onSelectCategory('all')}
        >
          <MaterialIcons
            name="apps"
            size={16}
            color={selectedCategory === 'all' ? '#fff' : colors.textSecondary}
          />
          <Text
            style={[
              styles.chipText,
              {
                color: selectedCategory === 'all' ? '#fff' : colors.textSecondary,
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Category Options */}
        {HABIT_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedCategory === cat.id ? cat.color : colors.surfaceVariant,
                borderColor: selectedCategory === cat.id ? cat.color : colors.border,
              },
            ]}
            onPress={() => onSelectCategory(cat.id)}
          >
            <MaterialIcons
              name={cat.icon as any}
              size={16}
              color={selectedCategory === cat.id ? '#fff' : colors.textSecondary}
            />
            <Text
              style={[
                styles.chipText,
                {
                  color: selectedCategory === cat.id ? '#fff' : colors.textSecondary,
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
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
