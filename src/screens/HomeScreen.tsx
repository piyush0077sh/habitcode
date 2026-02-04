import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { usePremium } from '../context/PremiumContext';
import { HabitCard } from '../components';
import AdBanner from '../components/AdBanner';
import { formatDisplayDate } from '../utils/dateUtils';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { activeHabits, toggleCompletion, isLoading } = useHabits();
  const { isPremium, FREE_HABIT_LIMIT } = usePremium();

  const today = new Date();

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
        <View style={styles.headerButtons}>
          {!isPremium && (
            <TouchableOpacity
              style={[styles.premiumButton]}
              onPress={() => navigation.navigate('Premium')}
            >
              <MaterialIcons name="workspace-premium" size={20} color="#FFD700" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.menuButton, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialIcons name="settings" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
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
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddHabit')}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={activeHabits}
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
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeHabits.length > 0 && (
        <TouchableOpacity
          style={[
            styles.fab, 
            { 
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            }
          ]}
          onPress={handleAddHabit}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add" size={30} color="#fff" />
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  premiumButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  greeting: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  date: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  limitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 10,
    gap: 8,
  },
  limitText: {
    fontSize: 13,
    fontWeight: '600',
  },
  upgradeLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 170,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 28,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
    opacity: 0.8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 36,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 82,
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
});

export default HomeScreen;
