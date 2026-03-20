import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Animated, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
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
import { STORAGE_KEYS, FONT, SHADOW } from './src/constants/theme';
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
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  HomeTab: 'home',
  StatsTab: 'bar-chart',
  AchievementsTab: 'emoji-events',
  LeaderboardTab: 'groups',
  SettingsTab: 'settings',
};

const BottomTabs: React.FC = () => {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontSize: 20,
          fontFamily: FONT.semibold,
        },
        headerTintColor: colors.text,
        tabBarIcon: ({ color }) => (
          <MaterialIcons
            name={TAB_ICONS[route.name] || 'circle'}
            size={22}
            color={color}
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          height: 56,
          paddingBottom: 6,
          paddingTop: 6,
          ...SHADOW.sm,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: FONT.medium,
          letterSpacing: 0.2,
        },
        tabBarButton: (props) => {
          const scaleValue = React.useRef(new Animated.Value(1)).current;
          return (
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleValue }] }}>
              <TouchableOpacity
                {...(props as any)}
                activeOpacity={0.8}
                onPressIn={(e: any) => {
                  Animated.spring(scaleValue, {
                    toValue: 0.85,
                    useNativeDriver: true,
                    speed: 50,
                    bounciness: 4,
                  }).start();
                  (props as any).onPressIn?.(e);
                }}
                onPressOut={(e: any) => {
                  Animated.spring(scaleValue, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 30,
                    bounciness: 10,
                  }).start();
                  (props as any).onPressOut?.(e);
                }}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              />
            </Animated.View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{ tabBarLabel: 'Stats', headerTitle: 'Statistics' }}
      />
      <Tab.Screen
        name="AchievementsTab"
        component={AchievementsScreen}
        options={{ tabBarLabel: 'Badges', headerTitle: 'Achievements' }}
      />
      <Tab.Screen
        name="LeaderboardTab"
        component={LeaderboardScreen}
        options={{ tabBarLabel: 'Friends', headerShown: false }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings', headerTitle: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

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
          <Stack.Screen
            name="MainTabs"
            component={BottomTabs}
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

  // Still loading onboarding status or fonts
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
