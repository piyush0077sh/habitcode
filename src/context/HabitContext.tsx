import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Habit, NewHabit, AppSettings } from '../types';
import {
  saveHabits,
  loadHabits,
  saveSettings,
  loadSettings,
  generateId,
} from '../utils/storage';
import { formatDate } from '../utils/dateUtils';
import {
  scheduleHabitReminder,
  cancelHabitReminder,
} from '../utils/notifications';

interface HabitContextType {
  habits: Habit[];
  activeHabits: Habit[];
  archivedHabits: Habit[];
  settings: AppSettings;
  isLoading: boolean;
  addHabit: (habit: NewHabit) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, date: Date) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  restoreHabit: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  importHabits: (habits: Habit[], settings?: AppSettings) => Promise<void>;
  refreshHabits: () => Promise<void>;
  clearAllHabits: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  themeMode: 'system',
  notificationsEnabled: true,
  weekStartsOn: 0,
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [loadedHabits, loadedSettings] = await Promise.all([
        loadHabits(),
        loadSettings(),
      ]);
      setHabits(loadedHabits);
      if (loadedSettings) {
        setSettings(loadedSettings);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHabits = useCallback(async () => {
    const loadedHabits = await loadHabits();
    setHabits(loadedHabits);
  }, []);

  const activeHabits = habits.filter((h) => !h.archived);
  const archivedHabits = habits.filter((h) => h.archived);

  const addHabit = useCallback(async (newHabit: NewHabit) => {
    const habit: Habit = {
      ...newHabit,
      id: generateId(),
      createdAt: new Date().toISOString(),
      archived: false,
      completions: [],
    };

    const updatedHabits = [...habits, habit];
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);

    if (habit.reminderEnabled && habit.reminderTime) {
      await scheduleHabitReminder(habit);
    }
  }, [habits]);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map((h) =>
      h.id === id ? { ...h, ...updates } : h
    );
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);

    const updatedHabit = updatedHabits.find((h) => h.id === id);
    if (updatedHabit) {
      if (updatedHabit.reminderEnabled && updatedHabit.reminderTime) {
        await scheduleHabitReminder(updatedHabit);
      } else {
        await cancelHabitReminder(id);
      }
    }
  }, [habits]);

  const deleteHabit = useCallback(async (id: string) => {
    await cancelHabitReminder(id);
    const updatedHabits = habits.filter((h) => h.id !== id);
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  }, [habits]);

  const toggleCompletion = useCallback(async (habitId: string, date: Date) => {
    const dateStr = formatDate(date);
    const updatedHabits = habits.map((h) => {
      if (h.id !== habitId) return h;

      const isCompleted = h.completions.includes(dateStr);
      const completions = isCompleted
        ? h.completions.filter((d) => d !== dateStr)
        : [...h.completions, dateStr];

      return { ...h, completions };
    });

    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  }, [habits]);

  const archiveHabit = useCallback(async (id: string) => {
    await cancelHabitReminder(id);
    await updateHabit(id, { archived: true });
  }, [updateHabit]);

  const restoreHabit = useCallback(async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    await updateHabit(id, { archived: false });
    
    if (habit?.reminderEnabled && habit?.reminderTime) {
      await scheduleHabitReminder({ ...habit, archived: false });
    }
  }, [habits, updateHabit]);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await saveSettings(newSettings);
  }, [settings]);

  const importHabits = useCallback(async (
    importedHabits: Habit[],
    importedSettings?: AppSettings
  ) => {
    setHabits(importedHabits);
    await saveHabits(importedHabits);

    if (importedSettings) {
      setSettings(importedSettings);
      await saveSettings(importedSettings);
    }

    // Reschedule all reminders
    for (const habit of importedHabits) {
      if (habit.reminderEnabled && habit.reminderTime && !habit.archived) {
        await scheduleHabitReminder(habit);
      }
    }
  }, []);

  const clearAllHabits = useCallback(async () => {
    // Cancel all reminders first
    for (const habit of habits) {
      await cancelHabitReminder(habit.id);
    }
    // Clear state
    setHabits([]);
    setSettings(defaultSettings);
  }, [habits]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        activeHabits,
        archivedHabits,
        settings,
        isLoading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        archiveHabit,
        restoreHabit,
        updateSettings,
        importHabits,
        refreshHabits,
        clearAllHabits,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
