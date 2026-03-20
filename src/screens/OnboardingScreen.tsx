import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { STORAGE_KEYS } from '../constants/theme';

interface OnboardingScreenProps {
  navigation: any;
  onComplete: () => void;
}

interface OnboardingItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    icon: 'add-task',
    title: 'Build New Habits',
    description: 'Create your habits and track your progress every day',
    color: '#22c55e',
  },
  {
    id: '2',
    icon: 'check-circle',
    title: 'Check It Off',
    description: 'Mark when you complete your habits with a simple tap',
    color: '#3b82f6',
  },
  {
    id: '3',
    icon: 'grid-view',
    title: 'See the Big Picture',
    description: 'Get your completions visualized in a beautiful tile grid',
    color: '#f97316',
  },
  {
    id: '4',
    icon: 'local-fire-department',
    title: 'Build Streaks',
    description: 'The streak count shows how consistent you are',
    color: '#ef4444',
  },
  {
    id: '5',
    icon: 'notifications-active',
    title: "Don't Miss a Day",
    description: 'Get notifications at your specified times',
    color: '#a855f7',
  },
  {
    id: '6',
    icon: 'palette',
    title: 'Customize Everything',
    description: 'Choose from different colors, icons and themes',
    color: '#06b6d4',
  },
  {
    id: '7',
    icon: 'emoji-events',
    title: 'Earn Achievements',
    description: 'Unlock badges as you build better habits',
    color: '#f59e0b',
  },
  {
    id: '8',
    icon: 'shield',
    title: 'Your Privacy Matters',
    description: 'Your data stays on your device. Always.',
    color: '#ec4899',
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation, onComplete }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Reactive – updates on orientation change and web viewport resize
  const { width, height } = useWindowDimensions();

  // Adapt icon size and text size to screen dimensions
  const iconContainerSize = Math.min(width * 0.38, 160);
  const titleFontSize = Math.min(26, width * 0.065);
  const descFontSize = Math.min(17, width * 0.042);

  const handleComplete = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    onComplete();
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const renderItem = ({ item, index }: { item: OnboardingItem; index: number }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    return (
      // Use the current `width` from useWindowDimensions so slides are always full-width
      <View style={[styles.slide, { width }]}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.color + '20',
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: iconContainerSize / 2,
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <MaterialIcons
            name={item.icon as any}
            size={iconContainerSize * 0.5}
            color={item.color}
          />
        </Animated.View>
        <Text style={[styles.title, { color: item.color, fontSize: titleFontSize }]}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary, fontSize: descFontSize }]}>
          {item.description}
        </Text>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.surfaceVariant]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: colors.text, fontSize: Math.min(28, width * 0.07) }]}>
              Welcome to{' '}
              <Text style={{ color: colors.primary }}>HabitCue</Text>
            </Text>
          </View>
          {currentIndex < onboardingData.length - 1 && (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>
                Skip
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content – getItemLayout prevents scroll misalignment */}
        <Animated.FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        />

        {/* Dots */}
        {renderDots()}

        {/* Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <MaterialIcons
              name={currentIndex === onboardingData.length - 1 ? 'check' : 'arrow-forward'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default OnboardingScreen;
