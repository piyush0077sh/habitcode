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
        <View style={[styles.card, { backgroundColor: '#0f0f1a' }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
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
            <View style={[styles.statDivider, { backgroundColor: '#2a2a3e' }]} />
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
                      backgroundColor: completed ? habit.color : '#1f1f2e',
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
    width: 320,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  habitName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  appName: {
    fontSize: 13,
    color: '#9ca3af',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 50,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  gridContainer: {
    marginBottom: 20,
  },
  gridTitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 12,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  gridTile: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  rateContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  rateLabel: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  actions: {
    marginTop: 20,
    gap: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
