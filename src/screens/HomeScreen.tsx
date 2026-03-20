import React, { useState, useRef, useCallback } from 'react';
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
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { usePremium } from '../context/PremiumContext';
import { HabitCard, CategoryFilter } from '../components';
import AdBanner from '../components/AdBanner';
import { formatDisplayDate } from '../utils/dateUtils';
import { HabitCategory } from '../types';
import { FONT, RADIUS, SPACING, SHADOW } from '../constants/theme';

interface HomeScreenProps {
  navigation: any;
}

// Ad banner height: scale with screen for better proportion on tablets
const getAdBannerHeight = (screenHeight: number) => Math.max(50, Math.min(80, screenHeight * 0.065));

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { activeHabits, toggleCompletion, isLoading } = useHabits();
  const { isPremium, FREE_HABIT_LIMIT } = usePremium();
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Reactive dimensions – updates on orientation change / web resize
  const { width, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Dynamic sizing based on current width
  const HEADER_ICON_SIZE = Math.max(18, Math.min(22, width * 0.052));
  const HEADER_BUTTON_SIZE = Math.max(36, Math.min(42, width * 0.088));
  const HORIZONTAL_PADDING = Math.max(SPACING.lg, width * 0.04);

  // On narrow phones (< 390 px), collapse secondary nav into a "More" button
  const isNarrow = width < 390;

  // Animated FAB (from collaborator)
  const adBannerHeight = getAdBannerHeight(screenHeight);
  const fabScaleAnim = useRef(new Animated.Value(1)).current;
  const fabRotateAnim = useRef(new Animated.Value(0)).current;

  const handleFabPressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(fabScaleAnim, {
        toValue: 0.88,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(fabRotateAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fabScaleAnim, fabRotateAnim]);

  const handleFabPressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(fabScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 10,
      }),
      Animated.timing(fabRotateAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fabScaleAnim, fabRotateAnim]);

  const fabRotation = fabRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const adHeight = isPremium ? 0 : adBannerHeight;
  const fabBottom = adHeight + 16;
  const listBottomPadding = adHeight + 80 + 16;

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
      color: colors.warning,
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
              <MaterialIcons name="workspace-premium" size={HEADER_ICON_SIZE} color={colors.warning} />
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
            style={[styles.addButton, { backgroundColor: colors.primary }, SHADOW.md]}
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
          contentContainerStyle={[
            styles.listContent,
            { paddingHorizontal: HORIZONTAL_PADDING, paddingBottom: listBottomPadding },
          ]}
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

      {/* Floating Add Habit button – animated */}
      {activeHabits.length > 0 && (
        <Animated.View
          style={[
            styles.fab,
            SHADOW.lg,
            {
              backgroundColor: colors.primary,
              right: HORIZONTAL_PADDING,
              bottom: fabBottom,
              transform: [
                { scale: fabScaleAnim },
                { rotate: fabRotation },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleAddHabit}
            onPressIn={handleFabPressIn}
            onPressOut={handleFabPressOut}
            activeOpacity={0.9}
            style={styles.fabInner}
          >
            <MaterialIcons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
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
    paddingVertical: SPACING.md,
  },
  dateWrapper: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
    alignItems: 'center',
  },
  headerIconButton: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  // "More" dropdown panel
  moreMenuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  moreMenuPanel: {
    position: 'absolute',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingVertical: SPACING.xs,
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  moreMenuLabel: {
    fontSize: 15,
    fontFamily: FONT.semibold,
  },

  greeting: {
    fontSize: 13,
    fontFamily: FONT.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  date: {
    fontFamily: FONT.bold,
    marginTop: SPACING.xs,
    letterSpacing: -0.5,
  },

  limitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.sm,
    gap: SPACING.sm,
  },
  limitText: {
    fontSize: 13,
    fontFamily: FONT.semibold,
  },
  upgradeLink: {
    fontSize: 13,
    fontFamily: FONT.bold,
  },

  listContent: { paddingTop: SPACING.sm },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: {
    fontSize: 24,
    fontFamily: FONT.bold,
    marginTop: SPACING.xxl,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 22,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xxxl,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONT.semibold,
    marginLeft: SPACING.sm,
  },

  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noResultsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  noResultsText: {
    fontSize: 15,
    fontFamily: FONT.medium,
    marginTop: SPACING.md,
  },
});

export default HomeScreen;
