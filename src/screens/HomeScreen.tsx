import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
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

  // Filter habits by category
  const filteredHabits = selectedCategory === 'all'
    ? activeHabits
    : activeHabits.filter(h => h.category === selectedCategory);

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

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Today
          </Text>
          <Text style={[styles.date, { color: colors.text }]}>
            {formatDisplayDate(today)}
          </Text>
        </View>
        {!isPremium && (
          <TouchableOpacity
            style={[styles.premiumButton]}
            onPress={() => navigation.navigate('Premium')}
          >
            <MaterialIcons name="workspace-premium" size={20} color={colors.warning} />
          </TouchableOpacity>
        )}
      </View>

      {!isPremium && activeHabits.length > 0 && (
        <View style={[styles.limitBadge, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.limitText, { color: colors.textSecondary }]}>
            {activeHabits.length}/{FREE_HABIT_LIMIT} habits
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Premium')}>
            <Text style={[styles.upgradeLink, { color: colors.primary }]}>
              Upgrade
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {activeHabits.length > 0 && (
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {activeHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name="emoji-events"
            size={80}
            color={colors.primary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Start Your Journey
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Create your first habit and begin tracking your progress
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }, SHADOW.md]}
            onPress={() => navigation.navigate('AddHabit')}
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
              onPress={() =>
                navigation.navigate('HabitDetail', { habitId: item.id })
              }
              onToggleToday={() => toggleCompletion(item.id, today)}
            />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: listBottomPadding }]}
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

      {activeHabits.length > 0 && (
        <Animated.View
          style={[
            styles.fab, 
            SHADOW.lg,
            { 
              backgroundColor: colors.primary,
              bottom: fabBottom,
              transform: [
                { scale: fabScaleAnim },
                { rotate: fabRotation },
              ],
            }
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

      {/* Ad Banner at bottom */}
      <AdBanner />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  premiumButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  greeting: {
    fontSize: 13,
    fontFamily: FONT.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 26,
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
    marginHorizontal: SPACING.xl,
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
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
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
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 15,
    fontFamily: FONT.medium,
    marginTop: SPACING.md,
  },
});

export default HomeScreen;
