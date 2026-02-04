import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, UserStats, Friend } from '../types';
import { STORAGE_KEYS } from '../constants/theme';
import { calculateStreak } from './dateUtils';

// Generate a unique friend code
export const generateFriendCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Get or create friend code
export const getOrCreateFriendCode = async (): Promise<string> => {
  try {
    let code = await AsyncStorage.getItem(STORAGE_KEYS.FRIEND_CODE);
    if (!code) {
      code = generateFriendCode();
      await AsyncStorage.setItem(STORAGE_KEYS.FRIEND_CODE, code);
    }
    return code;
  } catch (error) {
    console.error('Error getting friend code:', error);
    return generateFriendCode();
  }
};

// Get display name
export const getDisplayName = async (): Promise<string> => {
  try {
    const name = await AsyncStorage.getItem(STORAGE_KEYS.DISPLAY_NAME);
    return name || 'Me';
  } catch (error) {
    return 'Me';
  }
};

// Set display name
export const setDisplayName = async (name: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.DISPLAY_NAME, name);
};

// Calculate user stats from habits
export const calculateUserStats = async (habits: Habit[]): Promise<UserStats> => {
  const friendCode = await getOrCreateFriendCode();
  const displayName = await getDisplayName();
  
  const activeHabits = habits.filter(h => !h.archived);
  
  let totalCompletions = 0;
  let currentStreakBest = 0;
  let longestStreakBest = 0;
  
  for (const habit of activeHabits) {
    totalCompletions += habit.completions.length;
    const streak = calculateStreak(habit);
    if (streak.currentStreak > currentStreakBest) {
      currentStreakBest = streak.currentStreak;
    }
    if (streak.longestStreak > longestStreakBest) {
      longestStreakBest = streak.longestStreak;
    }
  }
  
  return {
    friendCode,
    displayName,
    totalCompletions,
    currentStreakBest,
    longestStreakBest,
    activeHabits: activeHabits.length,
    lastUpdated: new Date().toISOString(),
  };
};

// Get friends list
export const getFriends = async (): Promise<Friend[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading friends:', error);
    return [];
  }
};

// Save friends list
export const saveFriends = async (friends: Friend[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
};

// Add a friend (from shared stats)
export const addFriend = async (friendStats: UserStats): Promise<boolean> => {
  try {
    const myCode = await getOrCreateFriendCode();
    if (friendStats.friendCode === myCode) {
      return false; // Can't add yourself
    }
    
    const friends = await getFriends();
    const existingIndex = friends.findIndex(f => f.friendCode === friendStats.friendCode);
    
    const newFriend: Friend = {
      friendCode: friendStats.friendCode,
      displayName: friendStats.displayName,
      stats: friendStats,
      addedAt: existingIndex >= 0 ? friends[existingIndex].addedAt : new Date().toISOString(),
    };
    
    if (existingIndex >= 0) {
      friends[existingIndex] = newFriend;
    } else {
      friends.push(newFriend);
    }
    
    await saveFriends(friends);
    return true;
  } catch (error) {
    console.error('Error adding friend:', error);
    return false;
  }
};

// Remove a friend
export const removeFriend = async (friendCode: string): Promise<void> => {
  const friends = await getFriends();
  const filtered = friends.filter(f => f.friendCode !== friendCode);
  await saveFriends(filtered);
};

// Create shareable stats string
export const createShareableStats = async (habits: Habit[]): Promise<string> => {
  const stats = await calculateUserStats(habits);
  const encoded = Buffer.from(JSON.stringify(stats)).toString('base64');
  return `HABITCODE:${encoded}`;
};

// Parse shared stats string
export const parseSharedStats = (shareString: string): UserStats | null => {
  try {
    if (!shareString.startsWith('HABITCODE:')) {
      return null;
    }
    const encoded = shareString.replace('HABITCODE:', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error parsing shared stats:', error);
    return null;
  }
};

// Encode stats for sharing (works in React Native)
export const encodeStats = (stats: UserStats): string => {
  const json = JSON.stringify(stats);
  // Simple base64-like encoding that works in RN
  return `HABITCODE:${btoa(encodeURIComponent(json))}`;
};

// Decode shared stats (works in React Native)
export const decodeStats = (shareString: string): UserStats | null => {
  try {
    if (!shareString.startsWith('HABITCODE:')) {
      return null;
    }
    const encoded = shareString.replace('HABITCODE:', '');
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (error) {
    console.error('Error decoding stats:', error);
    return null;
  }
};
