import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { usePremium } from '../context/PremiumContext';
import { HabitCard, CategoryFilter } from '../components';
import AdBanner from '../components/AdBanner';
import { formatDisplayDate } from '../utils/dateUtils';
import { HabitCategory } from '../types';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { activeHabits, toggleCompletion, isLoading } = useHabits();
  const { isPremium, FREE_HABIT_LIMIT } = usePremium();
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Reactive dimensions – updates on orientation change / web resize
  const { width } = useWindowDimensions();

  // Dynamic sizing based on current width
  const HEADER_ICON_SIZE = Math.max(18, Math.min(24, width * 0.055));
  const HEADER_BUTTON_SIZE = Math.max(36, Math.min(44, width * 0.09));
  const FAB_SIZE = Math.max(52, Math.min(64, width * 0.14));
  const ADD_BUTTON_WIDTH = Math.min(width * 0.8, 320);
  const ADD_BUTTON_HEIGHT = 50;
  const HORIZONTAL_PADDING = Math.max(12, width * 0.04);

  // On narrow phones (< 390 px), collapse secondary nav into a "More" button
  const isNarrow = width < 390;

  const today = new Date();

  const filteredHabits =
    selectedCategory === 'all'
      ? activeHabits
      : activeHabits.filter((h) => h.category === selectedCategory);

  const handleAddHabit = () => {
    if (!isPremium && activeHabits.length >= FREE_HABIT_LIMIT) {
      Alert.alert(
        'Habit Limit Reached',
        `Free users can create up to ${FREE_HABIT_LIMIT} habits. Upgrade to Premium for unlimited habits!`,
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Go Premium ⭐', onPress: () => navigation.navigate('Premium') },
        ]
      );
      return;
    }
    navigation.navigate('AddHabit');
  };

  // Secondary nav items (collapsed on narrow screens)
  const secondaryNavItems = [
    {
      name: 'bar-chart' as const,
      color: colors.primary,
      label: 'Stats',
      route: 'Stats',
    },
    {
      name: 'emoji-events' as const,
      color: '#f59e0b',
      label: 'Achievements',
      route: 'Achievements',
    },
    {
      name: 'leaderboard' as const,
      color: colors.primary,
      label: 'Leaderboard',
      route: 'Leaderboard',
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: HORIZONTAL_PADDING }]}>
        {/* Date text – takes remaining space */}
        <View style={styles.dateWrapper}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Today</Text>
          <Text
            style={[styles.date, { color: colors.text, fontSize: Math.min(26, width * 0.07) }]}
            numberOfLines={1}
          >
            {formatDisplayDate(today)}
          </Text>
        </View>

        {/* Header buttons */}
        <View style={styles.headerButtons}>
          {/* Premium badge – always visible if not premium */}
          {!isPremium && (
            <TouchableOpacity
              style={[
                styles.headerIconButton,
                {
                  backgroundColor: 'rgba(255,215,0,0.15)',
                  width: HEADER_BUTTON_SIZE,
                  height: HEADER_BUTTON_SIZE,
                },
              ]}
              onPress={() => navigation.navigate('Premium')}
            >
              <MaterialIcons name="workspace-premium" size={HEADER_ICON_SIZE} color="#FFD700" />
            </TouchableOpacity>
          )}

          {/* On wide screens show all nav; on narrow screens collapse to More */}
          {isNarrow ? (
            <TouchableOpacity
              style={[
                styles.headerIconButton,
                {
                  backgroundColor: colors.surface,
                  width: HEADER_BUTTON_SIZE,
                  height: HEADER_BUTTON_SIZE,
                },
              ]}
              onPress={() => setShowMoreMenu(true)}
            >
              <MaterialIcons name="more-vert" size={HEADER_ICON_SIZE} color={colors.text} />
            </TouchableOpacity>
          ) : (
            secondaryNavItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.headerIconButton,
                  {
                    backgroundColor: colors.surface,
                    width: HEADER_BUTTON_SIZE,
                    height: HEADER_BUTTON_SIZE,
                  },
                ]}
                onPress={() => navigation.navigate(item.route)}
              >
                <MaterialIcons name={item.name} size={HEADER_ICON_SIZE} color={item.color} />
              </TouchableOpacity>
            ))
          )}

          {/* Settings – always visible */}
          <TouchableOpacity
            style={[
              styles.headerIconButton,
              {
                backgroundColor: colors.surface,
                width: HEADER_BUTTON_SIZE,
                height: HEADER_BUTTON_SIZE,
              },
            ]}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialIcons name="settings" size={HEADER_ICON_SIZE} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* "More" dropdown modal for narrow screens */}
      <Modal
        visible={showMoreMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <TouchableOpacity
          style={styles.moreMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowMoreMenu(false)}
        >
          <View
            style={[
              styles.moreMenuPanel,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                top: 80 + 16,
                right: HORIZONTAL_PADDING,
              },
            ]}
          >
            {secondaryNavItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={styles.moreMenuItem}
                onPress={() => {
                  setShowMoreMenu(false);
                  navigation.navigate(item.route);
                }}
              >
                <MaterialIcons name={item.name} size={22} color={item.color} />
                <Text style={[styles.moreMenuLabel, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Habit limit badge */}
      {!isPremium && activeHabits.length > 0 && (
        <View
          style={[
            styles.limitBadge,
            { backgroundColor: colors.surfaceVariant, marginHorizontal: HORIZONTAL_PADDING },
          ]}
        >
          <Text style={[styles.limitText, { color: colors.textSecondary }]}>
            {activeHabits.length}/{FREE_HABIT_LIMIT} habits
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Premium')}>
            <Text style={[styles.upgradeLink, { color: colors.primary }]}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Category filter */}
      {activeHabits.length > 0 && (
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      )}

      {/* Empty state */}
      {activeHabits.length === 0 ? (
        <View style={[styles.emptyContainer, { paddingHorizontal: HORIZONTAL_PADDING }]}>
          <MaterialIcons name="emoji-events" size={80} color={colors.primary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Start Your Journey</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Create your first habit and begin tracking your progress
          </Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: colors.primary, width: ADD_BUTTON_WIDTH, height: ADD_BUTTON_HEIGHT },
            ]}
            onPress={handleAddHabit}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
              onToggleToday={() => toggleCompletion(item.id, today)}
            />
          )}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: HORIZONTAL_PADDING }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <MaterialIcons name="search-off" size={48} color={colors.textSecondary} />
              <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                No habits in this category
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Add Habit button */}
      {activeHabits.length > 0 && (
        <TouchableOpacity
          style={[
            styles.fab,
            {
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: FAB_SIZE / 2,
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              right: HORIZONTAL_PADDING,
            },
          ]}
          onPress={handleAddHabit}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Ad Banner */}
      <AdBanner />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  dateWrapper: {
    flex: 1,
    marginRight: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
    alignItems: 'center',
  },
  headerIconButton: {
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  // "More" panel
  moreMenuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  moreMenuPanel: {
    position: 'absolute',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 6,
    minWidth: 160,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  moreMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  moreMenuLabel: {
    fontSize: 15,
    fontWeight: '600',
  },

  greeting: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.7 },
  date: { fontWeight: '800', marginTop: 2, letterSpacing: -0.5 },

  limitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    gap: 8,
  },
  limitText: { fontSize: 13, fontWeight: '600' },
  upgradeLink: { fontSize: 13, fontWeight: '700' },

  listContent: { paddingBottom: 170, paddingTop: 8 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 26, fontWeight: '800', marginTop: 28, textAlign: 'center', letterSpacing: -0.5 },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 12, lineHeight: 24, opacity: 0.8 },

  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16, marginTop: 36, shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', marginLeft: 10, letterSpacing: 0.3 },

  fab: { position: 'absolute', bottom: 82, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 },

  noResultsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  noResultsText: { fontSize: 16, marginTop: 12 },
});

export default HomeScreen;
