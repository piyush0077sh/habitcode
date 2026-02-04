// Habit Categories
export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'work'
  | 'learning'
  | 'personal'
  | 'finance'
  | 'social'
  | 'mindfulness'
  | 'other';

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  reminderTime: string | null;
  reminderEnabled: boolean;
  createdAt: string;
  archived: boolean;
  completions: string[]; // Array of date strings (YYYY-MM-DD)
}

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

// Achievement System
export type AchievementId = 
  | 'first_habit'
  | 'first_completion'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'streak_60'
  | 'streak_100'
  | 'streak_365'
  | 'completions_10'
  | 'completions_50'
  | 'completions_100'
  | 'completions_500'
  | 'completions_1000'
  | 'habits_3'
  | 'habits_5'
  | 'habits_10'
  | 'perfect_week'
  | 'perfect_month'
  | 'early_bird'
  | 'night_owl'
  | 'weekend_warrior'
  | 'consistency_king';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string | null;
  progress: number; // 0-100
  requirement: number;
  currentValue: number;
}

export interface AchievementNotification {
  achievement: Achievement;
  shown: boolean;
}

export interface HabitFrequencyConfig {
  type: HabitFrequency;
  daysPerWeek?: number; // For custom frequency
  targetDays?: number[]; // 0-6 (Sunday-Saturday)
}

export interface NewHabit {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  reminderTime: string | null;
  reminderEnabled: boolean;
}

export interface DayCompletion {
  date: string;
  completed: boolean;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  disabled: string;
}

export interface AppSettings {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
}

export interface ExportData {
  version: string;
  exportDate: string;
  habits: Habit[];
  settings: AppSettings;
}

// Leaderboard Types
export interface UserStats {
  friendCode: string;
  displayName: string;
  totalCompletions: number;
  currentStreakBest: number;
  longestStreakBest: number;
  activeHabits: number;
  lastUpdated: string;
}

export interface Friend {
  friendCode: string;
  displayName: string;
  stats: UserStats;
  addedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  friendCode: string;
  displayName: string;
  totalCompletions: number;
  currentStreakBest: number;
  longestStreakBest: number;
  activeHabits: number;
  isMe: boolean;
}
