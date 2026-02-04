import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { usePremium } from '../context/PremiumContext';
import { Logo } from '../components';
import { ThemeMode } from '../types';
import { exportData, importData, clearAllData } from '../utils/storage';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();
  const { isPremium } = usePremium();
  const {
    settings,
    updateSettings,
    archivedHabits,
    restoreHabit,
    habits,
    importHabits,
  } = useHabits();

  const handleContactDeveloper = () => {
    Linking.openURL('mailto:singhpiyush0077@gmail.com?subject=HabitCue%20Feedback');
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    updateSettings({ themeMode: mode });
  };

  const handleExport = async () => {
    try {
      await exportData(habits, settings);
      Alert.alert('Success', 'Data exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImport = async () => {
    try {
      const data = await importData();
      if (data) {
        Alert.alert(
          'Import Data',
          `Found ${data.habits.length} habits. This will replace your current data. Continue?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Import',
              onPress: async () => {
                await importHabits(data.habits, data.settings);
                Alert.alert('Success', 'Data imported successfully');
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import data. Please check the file format.');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your habits and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data has been cleared');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const SettingRow: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    danger?: boolean;
  }> = ({ icon, title, subtitle, onPress, rightElement, danger }) => (
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: danger
              ? colors.error + '20'
              : colors.primary + '20',
          },
        ]}
      >
        <MaterialIcons
          name={icon as any}
          size={20}
          color={danger ? colors.error : colors.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingTitle,
            { color: danger ? colors.error : colors.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );

  const ThemeOption: React.FC<{
    mode: ThemeMode;
    label: string;
    icon: string;
  }> = ({ mode, label, icon }) => (
    <TouchableOpacity
      style={[
        styles.themeOption,
        {
          backgroundColor:
            themeMode === mode ? colors.primary + '20' : colors.surfaceVariant,
          borderColor: themeMode === mode ? colors.primary : 'transparent',
        },
      ]}
      onPress={() => handleThemeChange(mode)}
    >
      <MaterialIcons
        name={icon as any}
        size={24}
        color={themeMode === mode ? colors.primary : colors.textSecondary}
      />
      <Text
        style={[
          styles.themeText,
          {
            color: themeMode === mode ? colors.primary : colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Section */}
        <TouchableOpacity
          style={[
            styles.premiumBanner,
            {
              backgroundColor: isPremium ? colors.success + '15' : '#FFD700' + '15',
              borderColor: isPremium ? colors.success : '#FFD700',
            },
          ]}
          onPress={() => navigation.navigate('Premium')}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="workspace-premium"
            size={28}
            color={isPremium ? colors.success : '#FFD700'}
          />
          <View style={styles.premiumBannerContent}>
            <Text
              style={[
                styles.premiumBannerTitle,
                { color: isPremium ? colors.success : '#FFD700' },
              ]}
            >
              {isPremium ? 'Premium Active ⭐' : 'Upgrade to Premium'}
            </Text>
            <Text style={[styles.premiumBannerSubtitle, { color: colors.textSecondary }]}>
              {isPremium
                ? 'All features unlocked'
                : 'Unlimited habits, no ads & more'}
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          APPEARANCE
        </Text>
        <View style={styles.themeContainer}>
          <ThemeOption mode="light" label="Light" icon="light-mode" />
          <ThemeOption mode="dark" label="Dark" icon="dark-mode" />
          <ThemeOption mode="system" label="System" icon="settings-suggest" />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          PREFERENCES
        </Text>
        <View style={styles.section}>
          <SettingRow
            icon="calendar-today"
            title="Week Starts On"
            subtitle={settings.weekStartsOn === 0 ? 'Sunday' : 'Monday'}
            onPress={() => {
              updateSettings({
                weekStartsOn: settings.weekStartsOn === 0 ? 1 : 0,
              });
            }}
          />
        </View>

        {archivedHabits.length > 0 && (
          <>
            <Text
              style={[styles.sectionHeader, { color: colors.textSecondary }]}
            >
              ARCHIVED HABITS ({archivedHabits.length})
            </Text>
            <View style={styles.section}>
              {archivedHabits.map((habit) => (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.archivedHabit,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => {
                    Alert.alert(
                      'Restore Habit',
                      `Do you want to restore "${habit.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Restore',
                          onPress: () => restoreHabit(habit.id),
                        },
                      ]
                    );
                  }}
                >
                  <View
                    style={[
                      styles.habitIcon,
                      { backgroundColor: habit.color + '20' },
                    ]}
                  >
                    <MaterialIcons
                      name={habit.icon as any}
                      size={20}
                      color={habit.color}
                    />
                  </View>
                  <Text
                    style={[styles.habitName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {habit.name}
                  </Text>
                  <MaterialIcons
                    name="restore"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          DATA
        </Text>
        <View style={styles.section}>
          <SettingRow
            icon="file-download"
            title="Export Data"
            subtitle="Save your habits to a file"
            onPress={handleExport}
          />
          <SettingRow
            icon="file-upload"
            title="Import Data"
            subtitle="Restore from a backup file"
            onPress={handleImport}
          />
          <SettingRow
            icon="delete-forever"
            title="Clear All Data"
            subtitle="Delete all habits and settings"
            onPress={handleClearData}
            danger
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          ABOUT
        </Text>
        <View style={styles.section}>
          <View style={[styles.logoSection, { backgroundColor: colors.surface }]}>
            <Logo size="medium" showText={true} />
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
          </View>
          <SettingRow
            icon="person"
            title="Developer"
            subtitle="Built with ❤️ by Piyush Singh"
            rightElement={null}
          />
          <SettingRow
            icon="email"
            title="Contact Developer"
            subtitle="singhpiyush0077@gmail.com"
            onPress={handleContactDeveloper}
          />
        </View>

        <View style={styles.privacyNote}>
          <MaterialIcons name="security" size={20} color={colors.success} />
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            Your data is stored locally on your device. We don't collect any personal information.
          </Text>
        </View>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          Made in India 🇮🇳
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 20,
    letterSpacing: 1,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    borderWidth: 2,
    gap: 14,
    marginBottom: 8,
  },
  premiumBannerContent: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  premiumBannerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    gap: 2,
    borderRadius: 18,
    overflow: 'hidden',
  },
  themeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    gap: 10,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 3,
    opacity: 0.8,
  },
  archivedHabit: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 32,
    padding: 18,
    gap: 14,
    borderRadius: 16,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.9,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 24,
    marginBottom: 16,
    fontWeight: '500',
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 8,
  },
  versionText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default SettingsScreen;
