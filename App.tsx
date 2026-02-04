import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { HabitProvider } from './src/context/HabitContext';
import { PremiumProvider } from './src/context/PremiumContext';
import { checkForUpdates } from './src/utils/updateChecker';
import {
  HomeScreen,
  AddHabitScreen,
  HabitDetailScreen,
  EditHabitScreen,
  SettingsScreen,
  LeaderboardScreen,
} from './src/screens';
import PremiumScreen from './src/screens/PremiumScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { colors, isDark } = useTheme();

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
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
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
            options={{
              title: 'Habit Details',
            }}
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
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Settings',
            }}
          />
          <Stack.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{
              title: 'Leaderboard',
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
  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PremiumProvider>
          <HabitProvider>
            <AppNavigator />
          </HabitProvider>
        </PremiumProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
