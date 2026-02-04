import { ThemeColors } from '../types';

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
};

export const APP_VERSION = '1.0.0';
