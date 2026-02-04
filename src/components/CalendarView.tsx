import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Habit } from '../types';
import {
  getMonthCalendarDays,
  formatDate,
  isDateCompleted,
  formatMonthYear,
  getWeekDayHeaders,
} from '../utils/dateUtils';
import { format, isToday, isFuture } from 'date-fns';

interface CalendarViewProps {
  habit: Habit;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayPress: (date: Date) => void;
  weekStartsOn?: 0 | 1;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  habit,
  currentMonth,
  onMonthChange,
  onDayPress,
  weekStartsOn = 0,
}) => {
  const { colors } = useTheme();
  const days = getMonthCalendarDays(currentMonth, weekStartsOn);
  const weekDayHeaders = getWeekDayHeaders(weekStartsOn);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.surfaceVariant }]}
          onPress={goToPreviousMonth}
        >
          <MaterialIcons name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: colors.text }]}>
          {formatMonthYear(currentMonth)}
        </Text>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.surfaceVariant }]}
          onPress={goToNextMonth}
        >
          <MaterialIcons name="chevron-right" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {weekDayHeaders.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={[styles.weekDayText, { color: colors.textSecondary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const isCompleted = isDateCompleted(habit, day);
          const isTodayDate = isToday(day);
          const isFutureDate = isFuture(day);

          return (
            <TouchableOpacity
              key={formatDate(day)}
              style={styles.dayCell}
              onPress={() => !isFutureDate && onDayPress(day)}
              disabled={isFutureDate}
            >
              <View
                style={[
                  styles.dayCircle,
                  {
                    backgroundColor: isCompleted
                      ? habit.color
                      : 'transparent',
                    borderWidth: isTodayDate ? 2 : 0,
                    borderColor: habit.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isCompleted
                        ? '#fff'
                        : isFutureDate
                        ? colors.disabled
                        : colors.text,
                    },
                  ]}
                >
                  {format(day, 'd')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CalendarView;
