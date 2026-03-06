import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  TextInput,
  Modal,
  RefreshControl,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { UserStats, Friend, LeaderboardEntry } from '../types';
import { FONT, RADIUS, SPACING, SHADOW, hexToRgba } from '../constants/theme';
import {
  calculateUserStats,
  getFriends,
  addFriend,
  removeFriend,
  getOrCreateFriendCode,
  getDisplayName,
  setDisplayName,
  encodeStats,
  decodeStats,
} from '../utils/leaderboard';

interface LeaderboardScreenProps {
  navigation: any;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { habits } = useHabits();
  
  const [myStats, setMyStats] = useState<UserStats | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [sortBy, setSortBy] = useState<'completions' | 'streak'>('completions');

  const loadData = useCallback(async () => {
    const stats = await calculateUserStats(habits);
    setMyStats(stats);
    setNameInput(stats.displayName);
    
    const friendsList = await getFriends();
    setFriends(friendsList);
    
    // Build leaderboard
    const entries: LeaderboardEntry[] = [
      {
        rank: 0,
        friendCode: stats.friendCode,
        displayName: stats.displayName,
        totalCompletions: stats.totalCompletions,
        currentStreakBest: stats.currentStreakBest,
        longestStreakBest: stats.longestStreakBest,
        activeHabits: stats.activeHabits,
        isMe: true,
      },
      ...friendsList.map(f => ({
        rank: 0,
        friendCode: f.friendCode,
        displayName: f.displayName,
        totalCompletions: f.stats.totalCompletions,
        currentStreakBest: f.stats.currentStreakBest,
        longestStreakBest: f.stats.longestStreakBest,
        activeHabits: f.stats.activeHabits,
        isMe: false,
      })),
    ];
    
    // Sort and assign ranks
    entries.sort((a, b) => {
      if (sortBy === 'completions') {
        return b.totalCompletions - a.totalCompletions;
      }
      return b.currentStreakBest - a.currentStreakBest;
    });
    
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    setLeaderboard(entries);
  }, [habits, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleShareStats = async () => {
    if (!myStats) return;
    
    const shareCode = encodeStats(myStats);
    
    try {
      await Share.share({
        message: `Add me on HabitCode! 🎯\n\nMy stats:\n📊 ${myStats.totalCompletions} completions\n🔥 ${myStats.currentStreakBest} day best streak\n\nPaste this code in the app:\n${shareCode}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share stats');
    }
  };

  const handleCopyCode = () => {
    if (!myStats) return;
    const shareCode = encodeStats(myStats);
    Clipboard.setString(shareCode);
    Alert.alert('Copied!', 'Share code copied to clipboard');
  };

  const handleAddFriend = async () => {
    const trimmed = friendCodeInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please paste a friend code');
      return;
    }
    
    const stats = decodeStats(trimmed);
    if (!stats) {
      Alert.alert('Error', 'Invalid friend code. Make sure you copied it correctly.');
      return;
    }
    
    const success = await addFriend(stats);
    if (success) {
      Alert.alert('Success', `Added ${stats.displayName} to your leaderboard!`);
      setShowAddModal(false);
      setFriendCodeInput('');
      loadData();
    } else {
      Alert.alert('Error', "You can't add yourself!");
    }
  };

  const handleRemoveFriend = (friend: LeaderboardEntry) => {
    Alert.alert(
      'Remove Friend',
      `Remove ${friend.displayName} from leaderboard?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeFriend(friend.friendCode);
            loadData();
          },
        },
      ]
    );
  };

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    await setDisplayName(trimmed);
    setShowEditNameModal(false);
    loadData();
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Leaderboard</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
            onPress={() => setShowAddModal(true)}
          >
            <MaterialIcons name="person-add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* My Stats Card */}
        {myStats && (
          <View style={[styles.myStatsCard, { backgroundColor: colors.primary }]}>
            <View style={styles.myStatsHeader}>
              <View>
                <Text style={styles.myName}>{myStats.displayName}</Text>
                <Text style={styles.myCode}>Code: {myStats.friendCode}</Text>
              </View>
              <TouchableOpacity 
                style={styles.editNameButton}
                onPress={() => setShowEditNameModal(true)}
              >
                <MaterialIcons name="edit" size={20} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.myStatsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{myStats.totalCompletions}</Text>
                <Text style={styles.statLabel}>Completions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{myStats.currentStreakBest}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{myStats.activeHabits}</Text>
                <Text style={styles.statLabel}>Habits</Text>
              </View>
            </View>

            <View style={styles.shareButtons}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShareStats}>
                <MaterialIcons name="share" size={18} color="#fff" />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={handleCopyCode}>
                <MaterialIcons name="content-copy" size={18} color="#fff" />
                <Text style={styles.shareButtonText}>Copy Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              { backgroundColor: sortBy === 'completions' ? colors.primary : colors.surface },
            ]}
            onPress={() => setSortBy('completions')}
          >
            <MaterialIcons 
              name="check-circle" 
              size={16} 
              color={sortBy === 'completions' ? '#fff' : colors.textSecondary} 
            />
            <Text style={[
              styles.sortText,
              { color: sortBy === 'completions' ? '#fff' : colors.textSecondary },
            ]}>
              Completions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              { backgroundColor: sortBy === 'streak' ? colors.primary : colors.surface },
            ]}
            onPress={() => setSortBy('streak')}
          >
            <MaterialIcons 
              name="local-fire-department" 
              size={16} 
              color={sortBy === 'streak' ? '#fff' : colors.textSecondary} 
            />
            <Text style={[
              styles.sortText,
              { color: sortBy === 'streak' ? '#fff' : colors.textSecondary },
            ]}>
              Streak
            </Text>
          </TouchableOpacity>
        </View>

        {/* Leaderboard */}
        {leaderboard.length === 1 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="group" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Add friends to compete on the leaderboard!{'\n'}
              Share your code and add theirs.
            </Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAddModal(true)}
            >
              <MaterialIcons name="person-add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Friend</Text>
            </TouchableOpacity>
          </View>
        ) : (
          leaderboard.map((entry) => (
            <TouchableOpacity
              key={entry.friendCode}
              style={[
                styles.leaderboardCard,
                { backgroundColor: colors.surface },
                entry.isMe && { borderWidth: 1.5, borderColor: colors.primary },
              ]}
              onLongPress={() => !entry.isMe && handleRemoveFriend(entry)}
              delayLongPress={500}
            >
              <Text style={styles.rank}>{getRankEmoji(entry.rank)}</Text>
              <View style={styles.friendInfo}>
                <Text style={[styles.friendName, { color: colors.text }]}>
                  {entry.displayName} {entry.isMe && '(You)'}
                </Text>
                <Text style={[styles.friendMeta, { color: colors.textSecondary }]}>
                  {entry.activeHabits} habits • 🔥 {entry.longestStreakBest} longest
                </Text>
              </View>
              <View style={styles.friendStats}>
                <Text style={[styles.friendStatValue, { color: colors.primary }]}>
                  {sortBy === 'completions' ? entry.totalCompletions : entry.currentStreakBest}
                </Text>
                <Text style={[styles.friendStatLabel, { color: colors.textSecondary }]}>
                  {sortBy === 'completions' ? 'completions' : 'day streak'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Friend Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Friend</Text>
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Paste the friend code that was shared with you:
            </Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Paste HABITCODE:... here"
              placeholderTextColor={colors.textSecondary}
              value={friendCodeInput}
              onChangeText={setFriendCodeInput}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => {
                  setShowAddModal(false);
                  setFriendCodeInput('');
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleAddFriend}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        visible={showEditNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Display Name</Text>
            <TextInput
              style={[styles.modalNameInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
              value={nameInput}
              onChangeText={setNameInput}
              maxLength={20}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => setShowEditNameModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveName}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  title: {
    fontSize: 26,
    fontFamily: FONT.bold,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  myStatsCard: {
    marginHorizontal: SPACING.lg,
    marginTop: 0,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  myStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  myName: {
    fontSize: 20,
    fontFamily: FONT.bold,
    color: '#fff',
  },
  myCode: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  editNameButton: {
    padding: SPACING.xs,
  },
  myStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontFamily: FONT.bold,
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  shareButtons: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  shareButtonText: {
    color: '#fff',
    fontFamily: FONT.semibold,
    fontSize: 14,
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    gap: SPACING.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  sortText: {
    fontSize: 13,
    fontFamily: FONT.medium,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  rank: {
    fontSize: 20,
    fontFamily: FONT.bold,
    width: 40,
    textAlign: 'center',
  },
  friendInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  friendName: {
    fontSize: 16,
    fontFamily: FONT.semibold,
  },
  friendMeta: {
    fontSize: 12,
    fontFamily: FONT.regular,
    marginTop: 2,
  },
  friendStats: {
    alignItems: 'flex-end',
  },
  friendStatValue: {
    fontSize: 17,
    fontFamily: FONT.bold,
  },
  friendStatLabel: {
    fontSize: 11,
    fontFamily: FONT.regular,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: SPACING.lg,
    lineHeight: 22,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: FONT.semibold,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONT.bold,
    marginBottom: SPACING.lg,
  },
  modalInput: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    fontSize: 14,
    fontFamily: FONT.regular,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalNameInput: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    fontSize: 16,
    fontFamily: FONT.regular,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md + 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: FONT.semibold,
    fontSize: 16,
  },
  hint: {
    fontSize: 13,
    fontFamily: FONT.regular,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
});

export default LeaderboardScreen;
