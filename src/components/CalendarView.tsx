import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
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
import { FONT, RADIUS, SPACING } from '../constants/theme';

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
  const [containerWidth, setContainerWidth] = useState(0);

  // Compute day circle size from container width: 7 columns with padding
  const daySize = containerWidth > 0 ? Math.min(Math.floor((containerWidth - 16) / 7) - 4, 42) : 36;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

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
    <View style={styles.container} onLayout={handleLayout}>
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
                    width: daySize,
                    height: daySize,
                    borderRadius: daySize / 2,
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
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 17,
    fontFamily: FONT.semibold,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  weekDayText: {
    fontSize: 12,
    fontFamily: FONT.semibold,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontFamily: FONT.medium,
  },
});

export default CalendarView;
