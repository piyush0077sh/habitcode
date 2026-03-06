import { ThemeColors, HabitCategory } from '../types';

// ─── DESIGN TOKENS ─────────────────────────────────────────
// Strict design system: spacing, radius, type scale, elevation

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const TYPE = {
  caption: { fontSize: 11, fontFamily: 'Inter_500Medium', letterSpacing: 0.2 },
  footnote: { fontSize: 13, fontFamily: 'Inter_400Regular', letterSpacing: 0 },
  body: { fontSize: 15, fontFamily: 'Inter_400Regular', letterSpacing: 0 },
  bodyMedium: { fontSize: 15, fontFamily: 'Inter_500Medium', letterSpacing: 0 },
  callout: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.2 },
  headline: { fontSize: 17, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.2 },
  title3: { fontSize: 20, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  title2: { fontSize: 22, fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
  title1: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  largeTitle: { fontSize: 34, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  display: { fontSize: 48, fontFamily: 'Inter_700Bold', letterSpacing: -1 },
} as const;

// Neutral shadows only — no colored glows
export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

// Helper: convert hex to rgba
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ─── COLOR PALETTE ─────────────────────────────────────────

export const LIGHT_COLORS: ThemeColors = {
  primary: '#4f46e5',
  primaryLight: 'rgba(79, 70, 229, 0.10)',
  background: '#f7f6f3',
  surface: '#ffffff',
  surfaceVariant: '#f0eeeb',
  text: '#1c1c1e',
  textSecondary: '#8e8e93',
  border: '#e8e6e1',
  success: '#34c759',
  warning: '#ff9f0a',
  error: '#ff3b30',
  disabled: '#c7c7cc',
};

export const DARK_COLORS: ThemeColors = {
  primary: '#818cf8',
  primaryLight: 'rgba(129, 140, 248, 0.12)',
  background: '#0f0f0f',
  surface: '#1c1c1e',
  surfaceVariant: '#2c2c2e',
  text: '#f2f2f7',
  textSecondary: '#8e8e93',
  border: '#38383a',
  success: '#30d158',
  warning: '#ff9f0a',
  error: '#ff453a',
  disabled: '#48484a',
};

// Accent color presets
export const ACCENT_COLORS = [
  { name: 'Indigo', light: '#4f46e5', dark: '#818cf8' },
  { name: 'Amber', light: '#f59e0b', dark: '#fbbf24' },
  { name: 'Violet', light: '#7c3aed', dark: '#a78bfa' },
  { name: 'Blue', light: '#3b82f6', dark: '#60a5fa' },
  { name: 'Cyan', light: '#06b6d4', dark: '#22d3ee' },
  { name: 'Green', light: '#22c55e', dark: '#4ade80' },
  { name: 'Pink', light: '#ec4899', dark: '#f472b6' },
  { name: 'Red', light: '#ef4444', dark: '#f87171' },
];

// Gradient backgrounds
export const GRADIENT_BACKGROUNDS = [
  { name: 'Default', colors: ['transparent', 'transparent'] },
  { name: 'Warm Ember', colors: ['#1f1510', '#121212'] },
  { name: 'Ocean', colors: ['#0f1a28', '#121212'] },
  { name: 'Forest', colors: ['#0f1f15', '#121212'] },
  { name: 'Sunset', colors: ['#1f1210', '#121212'] },
  { name: 'Midnight', colors: ['#13131f', '#121212'] },
  { name: 'Aurora', colors: ['#0f1a28', '#1a0f28'] },
];

// Habit Categories with icons and colors (using curated palette)
export const HABIT_CATEGORIES: { id: HabitCategory; name: string; icon: string; color: string }[] = [
  { id: 'health', name: 'Health', icon: 'favorite', color: '#ef6b6b' },
  { id: 'fitness', name: 'Fitness', icon: 'fitness-center', color: '#f09a5c' },
  { id: 'work', name: 'Work', icon: 'work', color: '#5ca8f0' },
  { id: 'learning', name: 'Learning', icon: 'school', color: '#7c8cf0' },
  { id: 'personal', name: 'Personal', icon: 'person', color: '#47b8b8' },
  { id: 'finance', name: 'Finance', icon: 'savings', color: '#6ec96e' },
  { id: 'social', name: 'Social', icon: 'people', color: '#f06b9a' },
  { id: 'mindfulness', name: 'Mindfulness', icon: 'self-improvement', color: '#a67df0' },
  { id: 'other', name: 'Other', icon: 'category', color: '#8e8e93' },
];

// Curated habit colors — consistent brightness/saturation
export const HABIT_COLORS = [
  '#ef6b6b', // Coral Red
  '#f09a5c', // Warm Orange
  '#f0c43e', // Golden
  '#6ec96e', // Fresh Green
  '#47b8b8', // Teal
  '#5ca8f0', // Sky Blue
  '#7c8cf0', // Soft Indigo
  '#a67df0', // Amethyst
  '#db6bdb', // Orchid
  '#f06b9a', // Rose
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

// Achievement Definitions (using curated palette colors)
export const ACHIEVEMENTS_CONFIG = [
  { id: 'first_habit', name: 'First Step', description: 'Create your first habit', icon: 'add-circle', color: '#6ec96e', requirement: 1 },
  { id: 'first_completion', name: 'Getting Started', description: 'Complete a habit for the first time', icon: 'check-circle', color: '#5ca8f0', requirement: 1 },
  { id: 'streak_3', name: 'On Fire', description: 'Reach a 3-day streak', icon: 'local-fire-department', color: '#f09a5c', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', description: 'Reach a 7-day streak', icon: 'whatshot', color: '#ef6b6b', requirement: 7 },
  { id: 'streak_14', name: 'Two Week Triumph', description: 'Reach a 14-day streak', icon: 'trending-up', color: '#7c8cf0', requirement: 14 },
  { id: 'streak_30', name: 'Monthly Master', description: 'Reach a 30-day streak', icon: 'emoji-events', color: '#f0c43e', requirement: 30 },
  { id: 'streak_60', name: 'Unstoppable', description: 'Reach a 60-day streak', icon: 'military-tech', color: '#47b8b8', requirement: 60 },
  { id: 'streak_100', name: 'Century Club', description: 'Reach a 100-day streak', icon: 'workspace-premium', color: '#f06b9a', requirement: 100 },
  { id: 'streak_365', name: 'Year of Excellence', description: 'Reach a 365-day streak', icon: 'diamond', color: '#a67df0', requirement: 365 },
  { id: 'completions_10', name: 'Dedicated', description: 'Complete 10 total habits', icon: 'star-outline', color: '#6ec96e', requirement: 10 },
  { id: 'completions_50', name: 'Committed', description: 'Complete 50 total habits', icon: 'star-half', color: '#47b8b8', requirement: 50 },
  { id: 'completions_100', name: 'Achiever', description: 'Complete 100 total habits', icon: 'star', color: '#f0c43e', requirement: 100 },
  { id: 'completions_500', name: 'High Performer', description: 'Complete 500 total habits', icon: 'stars', color: '#ef6b6b', requirement: 500 },
  { id: 'completions_1000', name: 'Legend', description: 'Complete 1000 total habits', icon: 'auto-awesome', color: '#a67df0', requirement: 1000 },
  { id: 'habits_3', name: 'Building Routine', description: 'Have 3 active habits', icon: 'format-list-bulleted', color: '#5ca8f0', requirement: 3 },
  { id: 'habits_5', name: 'Habit Builder', description: 'Have 5 active habits', icon: 'view-list', color: '#7c8cf0', requirement: 5 },
  { id: 'habits_10', name: 'Lifestyle Designer', description: 'Have 10 active habits', icon: 'view-module', color: '#a67df0', requirement: 10 },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Complete all habits for 7 days straight', icon: 'verified', color: '#6ec96e', requirement: 7 },
  { id: 'perfect_month', name: 'Perfect Month', description: 'Complete all habits for 30 days straight', icon: 'shield', color: '#f0c43e', requirement: 30 },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a habit before 7 AM', icon: 'wb-sunny', color: '#f0c43e', requirement: 1 },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a habit after 10 PM', icon: 'nightlight-round', color: '#7c8cf0', requirement: 1 },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Complete habits on 10 weekends', icon: 'weekend', color: '#47b8b8', requirement: 10 },
  { id: 'consistency_king', name: 'Consistency King', description: 'Maintain 80%+ completion rate for a month', icon: 'leaderboard', color: '#f06b9a', requirement: 80 },
];
