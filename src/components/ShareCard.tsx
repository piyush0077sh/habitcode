import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../context/ThemeContext';
import { Habit } from '../types';
import { calculateStreak } from '../utils/dateUtils';
import { FONT, RADIUS, SPACING, hexToRgba } from '../constants/theme';

interface ShareCardProps {
  habit: Habit;
  onClose?: () => void;
}

export const ShareCard: React.FC<ShareCardProps> = ({ habit, onClose }) => {
  const { colors } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);
  const streakInfo = calculateStreak(habit);

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not Available', 'Sharing is not available on web');
        return;
      }

      const uri = await viewShotRef.current?.capture?.();
      
      if (uri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share your habit progress',
          });
        } else {
          Alert.alert('Error', 'Sharing is not available on this device');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  // Calculate completion grid for last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    return habit.completions.includes(dateStr);
  });

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        }}
      >
        <View style={[styles.card, { backgroundColor: '#1a1a1a' }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: hexToRgba(habit.color, 0.12) }]}>
              <MaterialIcons name={habit.icon as any} size={32} color={habit.color} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.appName}>HabitCue</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="local-fire-department" size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{streakInfo.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: '#2a2a3e' }]} />
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={24} color="#a855f7" />
              <Text style={styles.statValue}>{streakInfo.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: '#383838' }]} />
            <View style={styles.statItem}>
              <MaterialIcons name="check-circle" size={24} color="#22c55e" />
              <Text style={styles.statValue}>{streakInfo.totalCompletions}</Text>
              <Text style={styles.statLabel}>Total Done</Text>
            </View>
          </View>

          {/* Completion Grid */}
          <View style={styles.gridContainer}>
            <Text style={styles.gridTitle}>Last 30 Days</Text>
            <View style={styles.grid}>
              {last30Days.map((completed, index) => (
                <View
                  key={index}
                  style={[
                    styles.gridTile,
                    {
                      backgroundColor: completed ? habit.color : '#2a2a2a',
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Completion Rate */}
          <View style={styles.rateContainer}>
            <Text style={[styles.rateValue, { color: habit.color }]}>
              {streakInfo.completionRate}%
            </Text>
            <Text style={styles.rateLabel}>Completion Rate (30 days)</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              📱 Track your habits with HabitCue
            </Text>
          </View>
        </View>
      </ViewShot>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: colors.primary }]}
          onPress={handleShare}
        >
          <MaterialIcons name="share" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Share Progress</Text>
        </TouchableOpacity>
        {onClose && (
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.surfaceVariant }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: colors.text }]}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  headerText: {
    flex: 1,
  },
  habitName: {
    fontSize: 20,
    fontFamily: FONT.bold,
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  appName: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: '#9ca3af',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xxl,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 50,
    backgroundColor: '#383838',
  },
  statValue: {
    fontSize: 22,
    fontFamily: FONT.bold,
    color: '#fff',
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: FONT.regular,
    color: '#9ca3af',
    marginTop: SPACING.xs,
  },
  gridContainer: {
    marginBottom: SPACING.xl,
  },
  gridTitle: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: '#9ca3af',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'center',
  },
  gridTile: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  rateContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  rateValue: {
    fontSize: 32,
    fontFamily: FONT.bold,
  },
  rateLabel: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: '#9ca3af',
    marginTop: SPACING.xs,
  },
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#383838',
  },
  footerText: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: '#9ca3af',
  },
  actions: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
    width: '100%',
    paddingHorizontal: SPACING.xl,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONT.semibold,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.md,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: FONT.semibold,
  },
});
