import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, AchievementId } from '../types';
import { STORAGE_KEYS, ACHIEVEMENTS_CONFIG } from '../constants/theme';

interface AchievementContextType {
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
  checkAndUnlockAchievements: (stats: AchievementStats) => Achievement | null;
  getAchievement: (id: AchievementId) => Achievement | undefined;
  newlyUnlocked: Achievement | null;
  clearNewlyUnlocked: () => void;
}

interface AchievementStats {
  totalHabits: number;
  totalCompletions: number;
  bestStreak: number;
  currentStreak: number;
  perfectDays: number;
  completionRate: number;
  completionHour?: number;
  weekendCompletions?: number;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) {
        setAchievements(JSON.parse(saved));
      } else {
        // Initialize with default achievements
        const initial: Achievement[] = ACHIEVEMENTS_CONFIG.map((config) => ({
          id: config.id as AchievementId,
          name: config.name,
          description: config.description,
          icon: config.icon,
          color: config.color,
          unlockedAt: null,
          progress: 0,
          requirement: config.requirement,
          currentValue: 0,
        }));
        setAchievements(initial);
        await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(initial));
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const saveAchievements = async (updated: Achievement[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));
      setAchievements(updated);
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  };

  const checkAndUnlockAchievements = useCallback((stats: AchievementStats): Achievement | null => {
    let unlocked: Achievement | null = null;

    const updated = achievements.map((achievement) => {
      if (achievement.unlockedAt) return achievement; // Already unlocked

      let currentValue = 0;
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_habit':
          currentValue = stats.totalHabits;
          shouldUnlock = currentValue >= 1;
          break;
        case 'first_completion':
          currentValue = stats.totalCompletions;
          shouldUnlock = currentValue >= 1;
          break;
        case 'streak_3':
        case 'streak_7':
        case 'streak_14':
        case 'streak_30':
        case 'streak_60':
        case 'streak_100':
        case 'streak_365':
          currentValue = stats.bestStreak;
          shouldUnlock = currentValue >= achievement.requirement;
          break;
        case 'completions_10':
        case 'completions_50':
        case 'completions_100':
        case 'completions_500':
        case 'completions_1000':
          currentValue = stats.totalCompletions;
          shouldUnlock = currentValue >= achievement.requirement;
          break;
        case 'habits_3':
        case 'habits_5':
        case 'habits_10':
          currentValue = stats.totalHabits;
          shouldUnlock = currentValue >= achievement.requirement;
          break;
        case 'perfect_week':
          currentValue = stats.perfectDays;
          shouldUnlock = currentValue >= 7;
          break;
        case 'perfect_month':
          currentValue = stats.perfectDays;
          shouldUnlock = currentValue >= 30;
          break;
        case 'early_bird':
          currentValue = stats.completionHour !== undefined && stats.completionHour < 7 ? 1 : 0;
          shouldUnlock = currentValue >= 1;
          break;
        case 'night_owl':
          currentValue = stats.completionHour !== undefined && stats.completionHour >= 22 ? 1 : 0;
          shouldUnlock = currentValue >= 1;
          break;
        case 'weekend_warrior':
          currentValue = stats.weekendCompletions || 0;
          shouldUnlock = currentValue >= 10;
          break;
        case 'consistency_king':
          currentValue = stats.completionRate;
          shouldUnlock = currentValue >= 80;
          break;
      }

      const progress = Math.min((currentValue / achievement.requirement) * 100, 100);

      if (shouldUnlock && !achievement.unlockedAt) {
        unlocked = {
          ...achievement,
          unlockedAt: new Date().toISOString(),
          progress: 100,
          currentValue,
        };
        return unlocked;
      }

      return {
        ...achievement,
        progress,
        currentValue,
      };
    });

    if (unlocked) {
      setNewlyUnlocked(unlocked);
      saveAchievements(updated);
    } else if (JSON.stringify(updated) !== JSON.stringify(achievements)) {
      saveAchievements(updated);
    }

    return unlocked;
  }, [achievements]);

  const getAchievement = useCallback((id: AchievementId): Achievement | undefined => {
    return achievements.find((a) => a.id === id);
  }, [achievements]);

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const totalCount = achievements.length;

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        unlockedCount,
        totalCount,
        checkAndUnlockAchievements,
        getAchievement,
        newlyUnlocked,
        clearNewlyUnlocked,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = (): AchievementContextType => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};
