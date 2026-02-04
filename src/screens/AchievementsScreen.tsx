import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAchievements } from '../context/AchievementContext';
import { Achievement } from '../types';

const { width } = Dimensions.get('window');

const AchievementsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { achievements, unlockedCount, totalCount } = useAchievements();

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const isUnlocked = !!achievement.unlockedAt;
    
    return (
      <View
        style={[
          styles.achievementCard,
          {
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
              backgroundColor: isUnlocked ? achievement.color + '20' : colors.border + '50',
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
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 16,
  },
  progressCircleContainer: {},
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  progressValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  progressTotal: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  achievementCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    textAlign: 'center',
  },
  unlockedDate: {
    fontSize: 11,
    marginTop: 4,
  },
});

export default AchievementsScreen;
