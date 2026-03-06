import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Habit } from '../types';
import { getLast7Days, isDateCompleted, calculateStreak } from '../utils/dateUtils';
import { FONT, RADIUS, SPACING, SHADOW, hexToRgba } from '../constants/theme';
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

  // Animation values
  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(1)).current;
  const checkRotate = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showPulse, setShowPulse] = useState(false);

  const handleCardPressIn = useCallback(() => {
    Animated.spring(cardScaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [cardScaleAnim]);

  const handleCardPressOut = useCallback(() => {
    Animated.spring(cardScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  }, [cardScaleAnim]);

  const handleToggle = () => {
    if (!isCompletedToday) {
      setShowPulse(true);

      Animated.sequence([
        Animated.parallel([
          Animated.spring(checkScale, {
            toValue: 1.3,
            friction: 3,
            tension: 200,
            useNativeDriver: true,
          }),
          Animated.timing(checkRotate, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowPulse(false));
    }

    checkRotate.setValue(0);
    onToggleToday();
  };

  return (
    <Animated.View style={{ transform: [{ scale: cardScaleAnim }] }}>
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
        },
        SHADOW.md,
      ]}
      onPress={onPress}
      onPressIn={handleCardPressIn}
      onPressOut={handleCardPressOut}
      activeOpacity={0.8}
    >
      {/* Subtle left-edge color indicator */}
      <View
        style={[
          styles.colorIndicator,
          { backgroundColor: habit.color },
        ]}
      />

      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: hexToRgba(habit.color, 0.10),
              },
            ]}
          >
            <MaterialIcons
              name={habit.icon as any}
              size={24}
              color={habit.color}
            />
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
              },
            ]}
            onPress={handleToggle}
            activeOpacity={0.7}
          >
            {showPulse && (
              <Animated.View
                style={[
                  styles.pulseCircle,
                  {
                    backgroundColor: hexToRgba(habit.color, 0.25),
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.5],
                      outputRange: [0.6, 0],
                    }),
                  },
                ]}
              />
            )}
            <Animated.View
              style={{
                transform: [
                  { scale: checkScale },
                  {
                    rotate: checkRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
            >
              {isCompletedToday ? (
                <MaterialIcons name="check" size={20} color="#fff" />
              ) : (
                <MaterialIcons name="circle" size={6} color={colors.disabled} />
              )}
            </Animated.View>
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

        <View style={styles.footer}>
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={16} color={colors.warning} />
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  colorIndicator: {
    width: 4,
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: FONT.semibold,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    fontFamily: FONT.regular,
    marginTop: 2,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    overflow: 'hidden',
  },
  pulseCircle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
  },
  gridContainer: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  streakText: {
    fontSize: 15,
    fontFamily: FONT.bold,
  },
  streakLabel: {
    fontSize: 13,
    fontFamily: FONT.regular,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  rateValue: {
    fontSize: 15,
    fontFamily: FONT.bold,
  },
  rateLabel: {
    fontSize: 11,
    fontFamily: FONT.medium,
  },
});

export default HabitCard;
