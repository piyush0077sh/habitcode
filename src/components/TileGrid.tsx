import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Habit } from '../types';
import { isDateCompleted, formatDate } from '../utils/dateUtils';
import { format } from 'date-fns';
import { FONT, RADIUS, SPACING, hexToRgba } from '../constants/theme';

interface TileGridProps {
  habit: Habit;
  days: Date[];
  tileSize?: number;
  gap?: number;
  showLabels?: boolean;
}

const TileGrid: React.FC<TileGridProps> = ({
  habit,
  days,
  tileSize = 24,
  gap = 4,
  showLabels = true,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { gap }]}>
        {days.map((day, index) => {
          const isCompleted = isDateCompleted(habit, day);
          const dateStr = formatDate(day);
          const isToday = index === days.length - 1;

          return (
            <View key={dateStr} style={styles.tileWrapper}>
              <View
                style={[
                  {
                    width: tileSize,
                    height: tileSize,
                    backgroundColor: isCompleted
                      ? habit.color
                      : hexToRgba(colors.textSecondary, 0.08),
                    borderRadius: RADIUS.sm,
                  },
                  isToday && {
                    borderWidth: 1.5,
                    borderColor: hexToRgba(habit.color, 0.5),
                  },
                ]}
              />
              {showLabels && (
                <Text
                  style={[
                    styles.dayLabel,
                    {
                      color: isToday ? colors.text : colors.textSecondary,
                      fontSize: tileSize * 0.33,
                      fontFamily: isToday ? FONT.semibold : FONT.medium,
                    },
                  ]}
                >
                  {format(day, 'EEE').charAt(0)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tileWrapper: {
    alignItems: 'center',
  },
  dayLabel: {
    marginTop: SPACING.xs,
    letterSpacing: 0.2,
  },
});

export default TileGrid;
