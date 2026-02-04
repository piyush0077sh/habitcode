import { ThemeColors, HabitCategory } from '../types';

export const LIGHT_COLORS: ThemeColors = {
  primary: '#7c3aed',
  primaryLight: '#a78bfa',
  background: '#f5f5f7',
  surface: '#ffffff',
  surfaceVariant: '#e8e8ed',
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  border: '#e5e5ea',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  disabled: '#d1d5db',
};

export const DARK_COLORS: ThemeColors = {
  primary: '#a78bfa',
  primaryLight: '#c4b5fd',
  background: '#0a0a0f',
  surface: '#16161f',
  surfaceVariant: '#1f1f2e',
  text: '#ffffff',
  textSecondary: '#9ca3af',
  border: '#2a2a3e',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  disabled: '#4b5563',
};

// Accent color presets
export const ACCENT_COLORS = [
  { name: 'Violet', light: '#7c3aed', dark: '#a78bfa' },
  { name: 'Blue', light: '#3b82f6', dark: '#60a5fa' },
  { name: 'Cyan', light: '#06b6d4', dark: '#22d3ee' },
  { name: 'Green', light: '#22c55e', dark: '#4ade80' },
  { name: 'Orange', light: '#f97316', dark: '#fb923c' },
  { name: 'Pink', light: '#ec4899', dark: '#f472b6' },
  { name: 'Red', light: '#ef4444', dark: '#f87171' },
  { name: 'Amber', light: '#f59e0b', dark: '#fbbf24' },
];

// Gradient backgrounds
export const GRADIENT_BACKGROUNDS = [
  { name: 'Default', colors: ['transparent', 'transparent'] },
  { name: 'Purple Haze', colors: ['#1a0a2e', '#16161f'] },
  { name: 'Ocean', colors: ['#0a1628', '#16161f'] },
  { name: 'Forest', colors: ['#0a1f1a', '#16161f'] },
  { name: 'Sunset', colors: ['#1f0a0a', '#16161f'] },
  { name: 'Midnight', colors: ['#0f0f1a', '#16161f'] },
  { name: 'Aurora', colors: ['#0a1a2e', '#1a0a2e'] },
];

// Habit Categories with icons and colors
export const HABIT_CATEGORIES: { id: HabitCategory; name: string; icon: string; color: string }[] = [
  { id: 'health', name: 'Health', icon: 'favorite', color: '#ef4444' },
  { id: 'fitness', name: 'Fitness', icon: 'fitness-center', color: '#f97316' },
  { id: 'work', name: 'Work', icon: 'work', color: '#3b82f6' },
  { id: 'learning', name: 'Learning', icon: 'school', color: '#8b5cf6' },
  { id: 'personal', name: 'Personal', icon: 'person', color: '#06b6d4' },
  { id: 'finance', name: 'Finance', icon: 'savings', color: '#22c55e' },
  { id: 'social', name: 'Social', icon: 'people', color: '#ec4899' },
  { id: 'mindfulness', name: 'Mindfulness', icon: 'self-improvement', color: '#a855f7' },
  { id: 'other', name: 'Other', icon: 'category', color: '#6b7280' },
];

export const HABIT_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
];

export const HABIT_ICONS = [
  'fitness-center',
  'directions-run',
  'directions-walk',
  'directions-bike',
  'pool',
  'self-improvement',
  'restaurant',
  'local-drink',
  'no-drinks',
  'menu-book',
  'school',
  'create',
  'code',
  'brush',
  'music-note',
  'headphones',
  'videogame-asset',
  'pets',
  'eco',
  'wb-sunny',
  'bedtime',
  'alarm',
  'favorite',
  'star',
  'emoji-events',
  'psychology',
  'savings',
  'cleaning-services',
  'home',
  'work',
];

export const STORAGE_KEYS = {
  HABITS: '@habitcode/habits',
  SETTINGS: '@habitcode/settings',
  THEME: '@habitcode/theme',
  FRIEND_CODE: '@habitcode/friendCode',
  DISPLAY_NAME: '@habitcode/displayName',
  FRIENDS: '@habitcode/friends',
  ONBOARDING_COMPLETE: '@habitcode/onboardingComplete',
  ACHIEVEMENTS: '@habitcode/achievements',
  ACCENT_COLOR: '@habitcode/accentColor',
  GRADIENT_BG: '@habitcode/gradientBackground',
};

export const APP_VERSION = '1.0.0';

// Achievement Definitions
export const ACHIEVEMENTS_CONFIG = [
  { id: 'first_habit', name: 'First Step', description: 'Create your first habit', icon: 'add-circle', color: '#22c55e', requirement: 1 },
  { id: 'first_completion', name: 'Getting Started', description: 'Complete a habit for the first time', icon: 'check-circle', color: '#3b82f6', requirement: 1 },
  { id: 'streak_3', name: 'On Fire', description: 'Reach a 3-day streak', icon: 'local-fire-department', color: '#f97316', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', description: 'Reach a 7-day streak', icon: 'whatshot', color: '#ef4444', requirement: 7 },
  { id: 'streak_14', name: 'Two Week Triumph', description: 'Reach a 14-day streak', icon: 'trending-up', color: '#8b5cf6', requirement: 14 },
  { id: 'streak_30', name: 'Monthly Master', description: 'Reach a 30-day streak', icon: 'emoji-events', color: '#f59e0b', requirement: 30 },
  { id: 'streak_60', name: 'Unstoppable', description: 'Reach a 60-day streak', icon: 'military-tech', color: '#06b6d4', requirement: 60 },
  { id: 'streak_100', name: 'Century Club', description: 'Reach a 100-day streak', icon: 'workspace-premium', color: '#ec4899', requirement: 100 },
  { id: 'streak_365', name: 'Year of Excellence', description: 'Reach a 365-day streak', icon: 'diamond', color: '#a855f7', requirement: 365 },
  { id: 'completions_10', name: 'Dedicated', description: 'Complete 10 total habits', icon: 'star-outline', color: '#84cc16', requirement: 10 },
  { id: 'completions_50', name: 'Committed', description: 'Complete 50 total habits', icon: 'star-half', color: '#22c55e', requirement: 50 },
  { id: 'completions_100', name: 'Achiever', description: 'Complete 100 total habits', icon: 'star', color: '#f59e0b', requirement: 100 },
  { id: 'completions_500', name: 'High Performer', description: 'Complete 500 total habits', icon: 'stars', color: '#ef4444', requirement: 500 },
  { id: 'completions_1000', name: 'Legend', description: 'Complete 1000 total habits', icon: 'auto-awesome', color: '#a855f7', requirement: 1000 },
  { id: 'habits_3', name: 'Building Routine', description: 'Have 3 active habits', icon: 'format-list-bulleted', color: '#06b6d4', requirement: 3 },
  { id: 'habits_5', name: 'Habit Builder', description: 'Have 5 active habits', icon: 'view-list', color: '#3b82f6', requirement: 5 },
  { id: 'habits_10', name: 'Lifestyle Designer', description: 'Have 10 active habits', icon: 'view-module', color: '#8b5cf6', requirement: 10 },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Complete all habits for 7 days straight', icon: 'verified', color: '#22c55e', requirement: 7 },
  { id: 'perfect_month', name: 'Perfect Month', description: 'Complete all habits for 30 days straight', icon: 'shield', color: '#f59e0b', requirement: 30 },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a habit before 7 AM', icon: 'wb-sunny', color: '#fbbf24', requirement: 1 },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a habit after 10 PM', icon: 'nightlight-round', color: '#6366f1', requirement: 1 },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Complete habits on 10 weekends', icon: 'weekend', color: '#14b8a6', requirement: 10 },
  { id: 'consistency_king', name: 'Consistency King', description: 'Maintain 80%+ completion rate for a month', icon: 'leaderboard', color: '#ec4899', requirement: 80 },
];
