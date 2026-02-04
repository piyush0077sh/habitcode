import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Habit } from '../types';
import { getLast7Days, isDateCompleted, calculateStreak } from '../utils/dateUtils';
import TileGrid from './TileGrid';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onToggleToday: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress, onToggleToday }) => {
  const { colors } = useTheme();
  const last7Days = getLast7Days();
  const today = new Date();
  const isCompletedToday = isDateCompleted(habit, today);
  const streakInfo = calculateStreak(habit);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: habit.color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Gradient accent bar */}
      <View 
        style={[
          styles.accentBar, 
          { backgroundColor: habit.color }
        ]} 
      />
      
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View 
              style={[
                styles.iconCircle, 
                { 
                  backgroundColor: habit.color + '15',
                  borderColor: habit.color + '30',
                }
              ]}
            >
              <MaterialIcons
                name={habit.icon as any}
                size={26}
                color={habit.color}
              />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {habit.name}
            </Text>
            {habit.description ? (
              <Text
                style={[styles.description, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {habit.description}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: isCompletedToday ? habit.color : 'transparent',
                borderColor: isCompletedToday ? habit.color : colors.border,
                shadowColor: isCompletedToday ? habit.color : 'transparent',
                shadowOpacity: isCompletedToday ? 0.4 : 0,
                shadowRadius: isCompletedToday ? 8 : 0,
                elevation: isCompletedToday ? 4 : 0,
              },
            ]}
            onPress={onToggleToday}
            activeOpacity={0.7}
          >
            {isCompletedToday ? (
              <MaterialIcons name="check" size={22} color="#fff" />
            ) : (
              <MaterialIcons name="radio-button-unchecked" size={22} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <TileGrid
            habit={habit}
            days={last7Days}
            tileSize={36}
            gap={6}
          />
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.streakContainer}>
            <View style={styles.streakIconWrapper}>
              <MaterialIcons name="local-fire-department" size={18} color="#f59e0b" />
            </View>
            <Text style={[styles.streakText, { color: colors.text }]}>
              {streakInfo.currentStreak}
            </Text>
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
              day streak
            </Text>
          </View>
          <View style={styles.rateContainer}>
            <Text style={[styles.rateValue, { color: colors.primary }]}>
              {streakInfo.completionRate}%
            </Text>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>
              30d
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  cardContent: {
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 14,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    marginTop: 3,
    opacity: 0.8,
  },
  checkButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
  },
  gridContainer: {
    marginVertical: 12,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIconWrapper: {
    marginRight: 6,
  },
  streakText: {
    fontSize: 17,
    fontWeight: '700',
    marginRight: 4,
  },
  streakLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rateValue: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  rateLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HabitCard;
