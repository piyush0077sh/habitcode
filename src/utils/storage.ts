import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import { Habit, AppSettings, ExportData } from '../types';
import { STORAGE_KEYS, APP_VERSION } from '../constants/theme';

// Check if running on web
const isWeb = Platform.OS === 'web';

// Get document directory - works at runtime
const getDocumentDirectory = (): string => {
  // @ts-ignore
  return FileSystem.documentDirectory || '';
};

export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
    throw error;
  }
};

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const loadSettings = async (): Promise<AppSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

export const exportData = async (
  habits: Habit[],
  settings: AppSettings
): Promise<void> => {
  try {
    const exportDataObj: ExportData = {
      version: APP_VERSION,
      exportDate: new Date().toISOString(),
      habits,
      settings,
    };

    const jsonString = JSON.stringify(exportDataObj, null, 2);
    const fileName = `habitcue-backup-${new Date().toISOString().split('T')[0]}.json`;

    if (isWeb) {
      // Web: Create a download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Native: Use file system and sharing
      const documentDir = getDocumentDirectory();
      if (!documentDir) {
        throw new Error('Document directory not available');
      }

      const filePath = `${documentDir}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, jsonString);

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Export HabitCue Data',
        });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const importData = async (): Promise<ExportData | null> => {
  try {
    if (isWeb) {
      // Web: Use file input
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = async (e: any) => {
          const file = e.target.files?.[0];
          if (!file) {
            resolve(null);
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const content = event.target?.result as string;
              const data: ExportData = JSON.parse(content);
              
              if (!data.habits || !Array.isArray(data.habits)) {
                reject(new Error('Invalid backup file: missing habits array'));
                return;
              }
              
              resolve(data);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        };

        input.oncancel = () => resolve(null);
        input.click();
      });
    } else {
      // Native: Use document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const fileUri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(fileUri);
      const data: ExportData = JSON.parse(content);

      if (!data.habits || !Array.isArray(data.habits)) {
        throw new Error('Invalid backup file: missing habits array');
      }

      return data;
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    // Clear all app data from AsyncStorage
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.HABITS,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.THEME,
      STORAGE_KEYS.FRIEND_CODE,
      STORAGE_KEYS.DISPLAY_NAME,
      STORAGE_KEYS.FRIENDS,
    ]);
    console.log('All data cleared from storage');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
