import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { usePremium } from '../context/PremiumContext';
import { Logo } from '../components';
import { ThemeMode } from '../types';
import { exportData, importData, clearAllData } from '../utils/storage';
import { ACCENT_COLORS, GRADIENT_BACKGROUNDS, FONT, RADIUS, SPACING, hexToRgba } from '../constants/theme';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { 
    colors, 
    themeMode, 
    setThemeMode, 
    isDark,
    accentColorIndex,
    setAccentColor,
    gradientIndex,
    setGradient,
  } = useTheme();
  const { isPremium } = usePremium();
  const {
    settings,
    updateSettings,
    archivedHabits,
    restoreHabit,
    habits,
    importHabits,
    clearAllHabits,
  } = useHabits();

  const handleContactDeveloper = () => {
    Linking.openURL('mailto:singhpiyush0077@gmail.com?subject=HabitCue%20Feedback');
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    updateSettings({ themeMode: mode });
  };

  // Helper for cross-platform alerts
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleExport = async () => {
    try {
      await exportData(habits, settings);
      showAlert('Success', 'Data exported successfully');
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to export data');
    }
  };

  const handleImport = async () => {
    try {
      const data = await importData();
      if (data) {
        if (Platform.OS === 'web') {
          const confirmed = window.confirm(
            `Import Data?\n\nFound ${data.habits.length} habits. This will replace your current data. Continue?`
          );
          if (confirmed) {
            await importHabits(data.habits, data.settings);
            showAlert('Success', 'Data imported successfully');
            window.location.reload();
          }
        } else {
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
      }
    } catch (error) {
      showAlert('Error', 'Failed to import data. Please check the file format.');
    }
  };

  const handleClearData = () => {
    if (Platform.OS === 'web') {
      // Web: Use native browser confirm
      const confirmed = window.confirm(
        'Clear All Data?\n\nThis will permanently delete all your habits and settings. This action cannot be undone.'
      );
      
      if (confirmed) {
        (async () => {
          try {
            await clearAllHabits();
            await clearAllData();
            window.alert('All data has been cleared!');
            window.location.reload();
          } catch (error) {
            console.error('Clear data error:', error);
            window.alert('Failed to clear data');
          }
        })();
      }
    } else {
      // Native: Use React Native Alert
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
                await clearAllHabits();
                await clearAllData();
                Alert.alert('Success', 'All data has been cleared!', [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                      });
                    },
                  },
                ]);
              } catch (error) {
                console.error('Clear data error:', error);
                Alert.alert('Error', 'Failed to clear data');
              }
            },
          },
        ]
      );
    }
  };

  const SettingRow: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    danger?: boolean;
  }> = ({ icon, title, subtitle, onPress, rightElement, danger }) => {
    const rowScale = useRef(new Animated.Value(1)).current;

    const handleRowPressIn = useCallback(() => {
      Animated.spring(rowScale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }, [rowScale]);

    const handleRowPressOut = useCallback(() => {
      Animated.spring(rowScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 6,
      }).start();
    }, [rowScale]);

    return (
    <Animated.View style={{ transform: [{ scale: rowScale }] }}>
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: colors.surface }]}
      onPress={onPress}
      onPressIn={handleRowPressIn}
      onPressOut={handleRowPressOut}
      disabled={!onPress && !rightElement}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: danger
              ? hexToRgba(colors.error, 0.12)
              : hexToRgba(colors.primary, 0.12),
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
    </Animated.View>
    );
  };

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
            themeMode === mode ? hexToRgba(colors.primary, 0.12) : colors.surfaceVariant,
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
              backgroundColor: isPremium ? hexToRgba(colors.success, 0.1) : hexToRgba('#FFD700', 0.1),
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

        {/* Accent Color Picker */}
        <Text style={[styles.subsectionHeader, { color: colors.text }]}>
          Accent Color
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.colorPickerScroll}
          contentContainerStyle={styles.colorPickerContent}
        >
          {ACCENT_COLORS.map((accent, index) => (
            <TouchableOpacity
              key={accent.name}
              style={[
                styles.accentColorOption,
                {
                  backgroundColor: isDark ? accent.dark : accent.light,
                  borderWidth: accentColorIndex === index ? 3 : 0,
                  borderColor: '#fff',
                },
              ]}
              onPress={() => setAccentColor(index)}
            >
              {accentColorIndex === index && (
                <MaterialIcons name="check" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Gradient Background (Dark mode only) */}
        {isDark && (
          <>
            <Text style={[styles.subsectionHeader, { color: colors.text }]}>
              Background Style
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.colorPickerScroll}
              contentContainerStyle={styles.colorPickerContent}
            >
              {GRADIENT_BACKGROUNDS.map((gradient, index) => (
                <TouchableOpacity
                  key={gradient.name}
                  style={[
                    styles.gradientOption,
                    {
                      backgroundColor: gradient.colors[0] === 'transparent' 
                        ? colors.surface 
                        : gradient.colors[0],
                      borderWidth: gradientIndex === index ? 2 : 1,
                      borderColor: gradientIndex === index ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setGradient(index)}
                >
                  <Text style={[styles.gradientLabel, { color: colors.text }]}>
                    {gradient.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

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
                    { backgroundColor: hexToRgba(habit.color, 0.12) },
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
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: FONT.semibold,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
    letterSpacing: 1,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  premiumBannerContent: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 16,
    fontFamily: FONT.bold,
  },
  premiumBannerSubtitle: {
    fontSize: 13,
    fontFamily: FONT.regular,
    marginTop: 2,
  },
  section: {
    gap: 2,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  themeContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  themeOption: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1.5,
    gap: SPACING.sm,
  },
  themeText: {
    fontSize: 14,
    fontFamily: FONT.semibold,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: FONT.semibold,
    letterSpacing: -0.2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: FONT.regular,
    marginTop: 3,
  },
  archivedHabit: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitName: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONT.semibold,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.xxxl,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONT.regular,
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: FONT.medium,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  versionText: {
    marginTop: SPACING.md,
    fontSize: 13,
    fontFamily: FONT.medium,
  },
  subsectionHeader: {
    fontSize: 15,
    fontFamily: FONT.semibold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  colorPickerScroll: {
    marginBottom: SPACING.sm,
  },
  colorPickerContent: {
    gap: SPACING.sm,
  },
  accentColorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientOption: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    minWidth: 80,
    alignItems: 'center',
  },
  gradientLabel: {
    fontSize: 12,
    fontFamily: FONT.medium,
  },
});

export default SettingsScreen;
