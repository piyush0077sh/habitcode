import React, { useState, useRef, useCallback } from 'react';
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
import { STORAGE_KEYS, FONT, RADIUS, SPACING, SHADOW, hexToRgba } from '../constants/theme';

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
    color: '#818cf8',
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
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Reactive – updates on orientation change and web viewport resize
  const { width } = useWindowDimensions();

  // Adapt sizes to screen width
  const iconContainerSize = Math.min(width * 0.38, 144);
  const titleFontSize = Math.min(26, width * 0.065);
  const descFontSize = Math.min(17, width * 0.042);

  const handleButtonPressIn = useCallback(() => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [buttonScaleAnim]);

  const handleButtonPressOut = useCallback(() => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();
  }, [buttonScaleAnim]);

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
      // Uses reactive `width` so slides are always exactly full-width
      <View style={[styles.slide, { width }]}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: hexToRgba(item.color, 0.12),
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

        {/* FlatList – getItemLayout prevents scroll misalignment on resize */}
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
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }, SHADOW.md]}
              onPress={handleNext}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
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
          </Animated.View>
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
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontFamily: FONT.bold,
    letterSpacing: -0.5,
  },
  skipText: {
    fontSize: 16,
    fontFamily: FONT.medium,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxxl + SPACING.sm,
  },
  title: {
    fontFamily: FONT.bold,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: FONT.regular,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl + SPACING.sm,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: FONT.semibold,
  },
});

export default OnboardingScreen;
