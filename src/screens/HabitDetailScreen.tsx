import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { CalendarView } from '../components';
import { calculateStreak, getLastNDays } from '../utils/dateUtils';

const HabitDetailScreen = ({
  route,
  navigation,
}: any) => {
  const { habitId } = route.params;
  const { colors } = useTheme();
  const { habits, toggleCompletion, archiveHabit, deleteHabit, settings } =
    useHabits();

  const habit = habits.find((h) => h.id === habitId);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const streakInfo = useMemo(() => {
    if (!habit) return null;
    return calculateStreak(habit);
  }, [habit]);

  if (!habit) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.text }}>Habit not found</Text>
      </SafeAreaView>
    );
  }

  const handleArchive = () => {
    Alert.alert(
      'Archive Habit',
      'This habit will be hidden from your dashboard. You can restore it later from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: async () => {
            await archiveHabit(habitId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      'This will permanently delete this habit and all its data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(habitId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const StatCard: React.FC<{
    icon: string;
    label: string;
    value: string | number;
    color?: string;
  }> = ({ icon, label, value, color }) => (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <MaterialIcons
        name={icon as any}
        size={24}
        color={color || colors.primary}
      />
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.habitHeader}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: habit.color + '20' },
            ]}
          >
            <MaterialIcons
              name={habit.icon as any}
              size={40}
              color={habit.color}
            />
          </View>
          <Text style={[styles.habitName, { color: colors.text }]}>
            {habit.name}
          </Text>
          {habit.description ? (
            <Text style={[styles.habitDescription, { color: colors.textSecondary }]}>
              {habit.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="local-fire-department"
            label="Current Streak"
            value={streakInfo?.currentStreak || 0}
            color={colors.warning}
          />
          <StatCard
            icon="emoji-events"
            label="Best Streak"
            value={streakInfo?.longestStreak || 0}
            color={habit.color}
          />
          <StatCard
            icon="check-circle"
            label="Total"
            value={streakInfo?.totalCompletions || 0}
            color={colors.success}
          />
          <StatCard
            icon="percent"
            label="Rate (30d)"
            value={`${streakInfo?.completionRate || 0}%`}
            color={colors.primary}
          />
        </View>

        <View
          style={[
            styles.calendarContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <CalendarView
            habit={habit}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onDayPress={(date) => toggleCompletion(habitId, date)}
            weekStartsOn={settings.weekStartsOn}
          />
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface }]}
            onPress={() =>
              navigation.navigate('EditHabit', { habitId: habit.id })
            }
          >
            <MaterialIcons name="edit" size={20} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Edit Habit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface }]}
            onPress={handleArchive}
          >
            <MaterialIcons name="archive" size={20} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Archive
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.error + '10' },
            ]}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  habitHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  habitName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  habitDescription: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  calendarContainer: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  actionsContainer: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HabitDetailScreen;
