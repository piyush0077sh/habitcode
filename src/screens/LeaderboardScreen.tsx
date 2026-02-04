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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    iconButton: {
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 12,
    },
    myStatsCard: {
      backgroundColor: colors.primary,
      margin: 16,
      marginTop: 0,
      borderRadius: 16,
      padding: 16,
    },
    myStatsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    myName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    myCode: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 2,
    },
    editNameButton: {
      padding: 4,
    },
    myStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    statLabel: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 2,
    },
    shareButtons: {
      flexDirection: 'row',
      marginTop: 16,
      gap: 8,
    },
    shareButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: 12,
      borderRadius: 12,
      gap: 6,
    },
    shareButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
    sortContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 8,
      gap: 8,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 4,
    },
    sortButtonActive: {
      backgroundColor: colors.primary,
    },
    sortButtonInactive: {
      backgroundColor: colors.surface,
    },
    sortText: {
      fontSize: 13,
      fontWeight: '500',
    },
    sortTextActive: {
      color: '#fff',
    },
    sortTextInactive: {
      color: colors.textSecondary,
    },
    leaderboardCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginVertical: 4,
      padding: 12,
      borderRadius: 12,
    },
    leaderboardCardMe: {
      borderWidth: 2,
      borderColor: colors.primary,
    },
    rank: {
      fontSize: 20,
      fontWeight: 'bold',
      width: 40,
      textAlign: 'center',
    },
    friendInfo: {
      flex: 1,
      marginLeft: 8,
    },
    friendName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    friendMeta: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    friendStats: {
      alignItems: 'flex-end',
    },
    friendStatValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
    },
    friendStatLabel: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      marginTop: 20,
      gap: 8,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      fontSize: 14,
      color: colors.text,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    modalNameInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
    },
    modalButtons: {
      flexDirection: 'row',
      marginTop: 16,
      gap: 12,
    },
    modalButton: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalButtonCancel: {
      backgroundColor: colors.background,
    },
    modalButtonConfirm: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontWeight: '600',
      fontSize: 16,
    },
    modalButtonTextCancel: {
      color: colors.textSecondary,
    },
    modalButtonTextConfirm: {
      color: '#fff',
    },
    hint: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 8,
      marginBottom: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
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
          <View style={styles.myStatsCard}>
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
              sortBy === 'completions' ? styles.sortButtonActive : styles.sortButtonInactive
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
              sortBy === 'completions' ? styles.sortTextActive : styles.sortTextInactive
            ]}>
              Completions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'streak' ? styles.sortButtonActive : styles.sortButtonInactive
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
              sortBy === 'streak' ? styles.sortTextActive : styles.sortTextInactive
            ]}>
              Streak
            </Text>
          </TouchableOpacity>
        </View>

        {/* Leaderboard */}
        {leaderboard.length === 1 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="group" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              Add friends to compete on the leaderboard!{'\n'}
              Share your code and add theirs.
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
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
                entry.isMe && styles.leaderboardCardMe
              ]}
              onLongPress={() => !entry.isMe && handleRemoveFriend(entry)}
              delayLongPress={500}
            >
              <Text style={styles.rank}>{getRankEmoji(entry.rank)}</Text>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>
                  {entry.displayName} {entry.isMe && '(You)'}
                </Text>
                <Text style={styles.friendMeta}>
                  {entry.activeHabits} habits • 🔥 {entry.longestStreakBest} longest
                </Text>
              </View>
              <View style={styles.friendStats}>
                <Text style={styles.friendStatValue}>
                  {sortBy === 'completions' ? entry.totalCompletions : entry.currentStreakBest}
                </Text>
                <Text style={styles.friendStatLabel}>
                  {sortBy === 'completions' ? 'completions' : 'day streak'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Friend Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <Text style={styles.hint}>
              Paste the friend code that was shared with you:
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Paste HABITCODE:... here"
              placeholderTextColor={colors.textSecondary}
              value={friendCodeInput}
              onChangeText={setFriendCodeInput}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowAddModal(false);
                  setFriendCodeInput('');
                }}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleAddFriend}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Display Name</Text>
            <TextInput
              style={styles.modalNameInput}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
              value={nameInput}
              onChangeText={setNameInput}
              maxLength={20}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowEditNameModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleSaveName}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>
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

export default LeaderboardScreen;
