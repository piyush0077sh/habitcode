import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { CalendarView, ShareCard } from '../components';
import { calculateStreak, getLastNDays } from '../utils/dateUtils';
import { FONT, RADIUS, SPACING, hexToRgba } from '../constants/theme';

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
  const [showShareModal, setShowShareModal] = useState(false);

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
              { backgroundColor: hexToRgba(habit.color, 0.12) },
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
            style={[styles.actionButton, { backgroundColor: hexToRgba(habit.color, 0.1) }]}
            onPress={() => setShowShareModal(true)}
          >
            <MaterialIcons name="share" size={20} color={habit.color} />
            <Text style={[styles.actionText, { color: habit.color }]}>
              Share Progress
            </Text>
          </TouchableOpacity>

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
              { backgroundColor: hexToRgba(colors.error, 0.08) },
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

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <ShareCard habit={habit} onClose={() => setShowShareModal(false)} />
          </View>
        </View>
      </Modal>
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
    padding: SPACING.xl,
  },
  habitHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  habitName: {
    fontSize: 22,
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  habitDescription: {
    fontSize: 15,
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  statValue: {
    fontSize: 22,
    fontFamily: FONT.bold,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONT.medium,
    marginTop: SPACING.xs,
  },
  calendarContainer: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.xl,
  },
  actionsContainer: {
    gap: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
  },
  actionText: {
    fontSize: 16,
    fontFamily: FONT.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 400,
  },
});

export default HabitDetailScreen;
