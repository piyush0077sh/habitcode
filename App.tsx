import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { HabitProvider } from './src/context/HabitContext';
import { PremiumProvider } from './src/context/PremiumContext';
import { AchievementProvider } from './src/context/AchievementContext';
import { checkForUpdates } from './src/utils/updateChecker';
import { STORAGE_KEYS, FONT } from './src/constants/theme';
import {
  HomeScreen,
  AddHabitScreen,
  HabitDetailScreen,
  EditHabitScreen,
  SettingsScreen,
  LeaderboardScreen,
  OnboardingScreen,
  StatsScreen,
  AchievementsScreen,
} from './src/screens';
import PremiumScreen from './src/screens/PremiumScreen';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  showOnboarding: boolean;
  onOnboardingComplete: () => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ showOnboarding, onOnboardingComplete }) => {
  const { colors, isDark } = useTheme();

  if (showOnboarding) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <OnboardingScreen navigation={{}} onComplete={onOnboardingComplete} />
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            notification: colors.primary,
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerTitleStyle: {
              fontFamily: FONT.semibold,
              fontSize: 17,
            },
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          {/* Home – no header, it has its own custom header */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          {/* Secondary screens – navigated to from the header buttons */}
          <Stack.Screen
            name="Stats"
            component={StatsScreen}
            options={{ title: 'Statistics' }}
          />
          <Stack.Screen
            name="Achievements"
            component={AchievementsScreen}
            options={{ title: 'Achievements' }}
          />
          <Stack.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />

          {/* Modal screens */}
          <Stack.Screen
            name="AddHabit"
            component={AddHabitScreen}
            options={{
              title: 'New Habit',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="HabitDetail"
            component={HabitDetailScreen}
            options={{ title: 'Habit Details' }}
          />
          <Stack.Screen
            name="EditHabit"
            component={EditHabitScreen}
            options={{
              title: 'Edit Habit',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="Premium"
            component={PremiumScreen}
            options={{
              title: 'Premium',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    checkForUpdates();
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      setShowOnboarding(hasSeenOnboarding !== 'true');
    } catch {
      setShowOnboarding(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding === null || !fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' }}>
        <ActivityIndicator size="large" color="#818cf8" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PremiumProvider>
          <HabitProvider>
            <AchievementProvider>
              <AppNavigator
                showOnboarding={showOnboarding}
                onOnboardingComplete={handleOnboardingComplete}
              />
            </AchievementProvider>
          </HabitProvider>
        </PremiumProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
