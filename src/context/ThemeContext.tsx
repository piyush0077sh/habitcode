import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, ThemeColors } from '../types';
import { LIGHT_COLORS, DARK_COLORS, STORAGE_KEYS, ACCENT_COLORS, GRADIENT_BACKGROUNDS } from '../constants/theme';

interface ThemeContextType {
  themeMode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  accentColorIndex: number;
  setAccentColor: (index: number) => void;
  gradientIndex: number;
  setGradient: (index: number) => void;
  gradientColors: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Convert hex color to rgba string
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [accentColorIndex, setAccentColorIndex] = useState(0);
  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const [savedTheme, savedAccent, savedGradient] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.ACCENT_COLOR),
        AsyncStorage.getItem(STORAGE_KEYS.GRADIENT_BG),
      ]);
      if (savedTheme) {
        setThemeModeState(savedTheme as ThemeMode);
      }
      if (savedAccent) {
        setAccentColorIndex(parseInt(savedAccent, 10));
      }
      if (savedGradient) {
        setGradientIndex(parseInt(savedGradient, 10));
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const setAccentColor = async (index: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, index.toString());
      setAccentColorIndex(index);
    } catch (error) {
      console.error('Error saving accent color:', error);
    }
  };

  const setGradient = async (index: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GRADIENT_BG, index.toString());
      setGradientIndex(index);
    } catch (error) {
      console.error('Error saving gradient:', error);
    }
  };

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');

  // Apply accent color to base colors
  const accent = ACCENT_COLORS[accentColorIndex] || ACCENT_COLORS[0];
  const baseColors = isDark ? DARK_COLORS : LIGHT_COLORS;
  const accentColor = isDark ? accent.dark : accent.light;
  const colors: ThemeColors = {
    ...baseColors,
    primary: accentColor,
    primaryLight: hexToRgba(accentColor, 0.15),
  };

  const gradientColors = GRADIENT_BACKGROUNDS[gradientIndex]?.colors || GRADIENT_BACKGROUNDS[0].colors;

  return (
    <ThemeContext.Provider value={{ 
      themeMode, 
      colors, 
      isDark, 
      setThemeMode,
      accentColorIndex,
      setAccentColor,
      gradientIndex,
      setGradient,
      gradientColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
