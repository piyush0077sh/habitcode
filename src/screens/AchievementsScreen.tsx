import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAchievements } from '../context/AchievementContext';
import { Achievement } from '../types';
import { FONT, RADIUS, SPACING, hexToRgba } from '../constants/theme';

const AchievementsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { achievements, unlockedCount, totalCount } = useAchievements();
  const { width } = useWindowDimensions();
  // Clamp cardWidth between 100 and calculated width so ultra-small phones don't squish cards
  const cardWidth = Math.max(100, (width - 44) / 2);

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const isUnlocked = !!achievement.unlockedAt;
    
    return (
      <View
        style={[
          styles.achievementCard,
          {
            width: cardWidth,
            backgroundColor: isUnlocked ? colors.surface : colors.surfaceVariant,
            borderColor: isUnlocked ? achievement.color : colors.border,
            opacity: isUnlocked ? 1 : 0.7,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isUnlocked 
                ? hexToRgba(achievement.color, 0.12) 
                : hexToRgba(colors.border, 0.3),
            },
          ]}
        >
          <MaterialIcons
            name={achievement.icon as any}
            size={32}
            color={isUnlocked ? achievement.color : colors.textSecondary}
          />
          {isUnlocked && (
            <View style={[styles.checkBadge, { backgroundColor: achievement.color }]}>
              <MaterialIcons name="check" size={12} color="#fff" />
            </View>
          )}
        </View>
        <Text
          style={[
            styles.achievementName,
            { color: isUnlocked ? colors.text : colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {achievement.name}
        </Text>
        <Text
          style={[styles.achievementDescription, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {achievement.description}
        </Text>
        {!isUnlocked && (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: achievement.color,
                    width: `${achievement.progress}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {achievement.currentValue}/{achievement.requirement}
            </Text>
          </View>
        )}
        {isUnlocked && achievement.unlockedAt && (
          <Text style={[styles.unlockedDate, { color: colors.textSecondary }]}>
            {new Date(achievement.unlockedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    );
  };

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
        {/* Progress Header */}
        <View style={[styles.progressHeader, { backgroundColor: colors.surface }]}>
          <View style={styles.progressCircleContainer}>
            <View
              style={[
                styles.progressCircle,
                { borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.progressValue, { color: colors.primary }]}>
                {unlockedCount}
              </Text>
              <Text style={[styles.progressTotal, { color: colors.textSecondary }]}>
                /{totalCount}
              </Text>
            </View>
          </View>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>
              Achievements Unlocked
            </Text>
            <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
              Complete habits to unlock more badges
            </Text>
          </View>
        </View>

        {/* Unlocked Section */}
        {unlockedAchievements.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🏆 Unlocked ({unlockedAchievements.length})
            </Text>
            <View style={styles.achievementsGrid}>
              {unlockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </View>
          </>
        )}

        {/* Locked Section */}
        {lockedAchievements.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🔒 In Progress ({lockedAchievements.length})
            </Text>
            <View style={styles.achievementsGrid}>
              {lockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </View>
          </>
        )}
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
    padding: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  progressCircleContainer: {},
  progressCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  progressValue: {
    fontSize: 26,
    fontFamily: FONT.bold,
  },
  progressTotal: {
    fontSize: 15,
    fontFamily: FONT.medium,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 17,
    fontFamily: FONT.bold,
    marginBottom: SPACING.xs,
  },
  progressSubtitle: {
    fontSize: 14,
    fontFamily: FONT.regular,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: FONT.bold,
    marginBottom: SPACING.lg,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  achievementCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementName: {
    fontSize: 14,
    fontFamily: FONT.semibold,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: FONT.regular,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: SPACING.sm,
  },
  progressContainer: {
    width: '100%',
    marginTop: SPACING.xs,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontFamily: FONT.medium,
    textAlign: 'center',
  },
  unlockedDate: {
    fontSize: 11,
    fontFamily: FONT.regular,
    marginTop: SPACING.xs,
  },
});

export default AchievementsScreen;
