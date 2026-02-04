export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  reminderTime: string | null;
  reminderEnabled: boolean;
  createdAt: string;
  archived: boolean;
  completions: string[]; // Array of date strings (YYYY-MM-DD)
}

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

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
