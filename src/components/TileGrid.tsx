import React from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Habit } from '../types';
import { isDateCompleted, formatDate } from '../utils/dateUtils';
import { format } from 'date-fns';

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

  const getIntensityColor = (isCompleted: boolean, baseColor: string) => {
    if (!isCompleted) {
      return colors.surfaceVariant;
    }
    return baseColor;
  };

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
                  styles.tile,
                  {
                    width: tileSize,
                    height: tileSize,
                    backgroundColor: getIntensityColor(isCompleted, habit.color),
                    borderRadius: tileSize * 0.25,
                    opacity: isCompleted ? 1 : 0.4,
                    transform: [{ scale: isToday ? 1.05 : 1 }],
                  },
                  isToday && styles.todayTile,
                  isCompleted && styles.completedTile,
                ]}
              />
              {showLabels && (
                <Text
                  style={[
                    styles.dayLabel,
                    { 
                      color: isToday ? colors.primary : colors.textSecondary, 
                      fontSize: tileSize * 0.38,
                      fontWeight: isToday ? '700' : '500',
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
  tile: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  todayTile: {
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  completedTile: {
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dayLabel: {
    marginTop: 6,
    letterSpacing: 0.3,
  },
});

export default TileGrid;
