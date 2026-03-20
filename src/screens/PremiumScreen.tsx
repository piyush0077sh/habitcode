import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';
import { Logo } from '../components';
import { FONT, RADIUS, SPACING, SHADOW, hexToRgba } from '../constants/theme';

interface PremiumScreenProps {
  navigation: any;
}

const FEATURES = [
  {
    icon: 'all-inclusive',
    title: 'Unlimited Habits',
    description: 'Track as many habits as you want',
    free: '3 habits',
    premium: 'Unlimited',
  },
  {
    icon: 'block',
    title: 'No Ads',
    description: 'Enjoy an ad-free experience',
    free: 'With ads',
    premium: 'Ad-free',
  },
  {
    icon: 'insights',
    title: 'Advanced Analytics',
    description: 'Detailed stats, trends, and insights',
    free: 'Basic stats',
    premium: 'Full analytics',
  },
  {
    icon: 'palette',
    title: 'All Themes',
    description: 'Access all color themes and customization',
    free: '2 themes',
    premium: 'All themes',
  },
  {
    icon: 'cloud-upload',
    title: 'Cloud Backup',
    description: 'Sync and backup your data securely',
    free: 'Local only',
    premium: 'Cloud sync',
  },
  {
    icon: 'stars',
    title: 'Custom Icons',
    description: 'Unlock premium icon packs',
    free: 'Basic icons',
    premium: '500+ icons',
  },
];

const PRICE = '$4.99';
const PRICE_PERIOD = 'one-time';

const PremiumScreen: React.FC<PremiumScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { isPremium, upgradeToPremium, restorePurchase, purchaseDate } = usePremium();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would integrate with RevenueCat or in-app purchases
      // For demo, we'll simulate a purchase
      Alert.alert(
        'Purchase Premium',
        `Upgrade to HabitCue Premium for ${PRICE} (${PRICE_PERIOD})?\n\nThis is a demo - tap "Buy" to simulate purchase.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy',
            onPress: async () => {
              await upgradeToPremium();
              Alert.alert(
                '🎉 Welcome to Premium!',
                'Thank you for your support! All premium features are now unlocked.',
                [{ text: 'Awesome!', onPress: () => navigation.goBack() }]
              );
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const restored = await restorePurchase();
      if (restored) {
        Alert.alert('Success', 'Your purchase has been restored!');
      } else {
        Alert.alert('Not Found', 'No previous purchase found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchase.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPremium) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <ScrollView
          contentContainerStyle={styles.premiumActiveContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.premiumBadge}>
            <MaterialIcons name="workspace-premium" size={80} color="#FFD700" />
          </View>
          <Text style={[styles.premiumTitle, { color: colors.text }]}>
            You're Premium! ⭐
          </Text>
          <Text style={[styles.premiumSubtitle, { color: colors.textSecondary }]}>
            Thank you for supporting HabitCue
          </Text>
          {purchaseDate && (
            <Text style={[styles.purchaseDate, { color: colors.textSecondary }]}>
              Member since {purchaseDate.toLocaleDateString()}
            </Text>
          )}

          <View style={[styles.featuresUnlocked, { backgroundColor: colors.surface }]}>
            <Text style={[styles.unlockedTitle, { color: colors.success }]}>
              ✓ All Features Unlocked
            </Text>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.unlockedFeature}>
                <MaterialIcons name={feature.icon as any} size={20} color={colors.success} />
                <Text style={[styles.unlockedText, { color: colors.text }]}>
                  {feature.title}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Logo size="large" showText={false} />
          <Text style={[styles.title, { color: colors.text }]}>
            HabitCue Premium
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Unlock your full potential
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <View
              key={index}
              style={[styles.featureRow, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.featureIcon, { backgroundColor: hexToRgba(colors.primary, 0.12) }]}>
                <MaterialIcons
                  name={feature.icon as any}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featureInfo}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
              <View style={styles.featureComparison}>
                <Text style={[styles.freeLabel, { color: colors.error }]}>
                  {feature.free}
                </Text>
                <MaterialIcons name="arrow-forward" size={12} color={colors.textSecondary} />
                <Text style={[styles.premiumLabel, { color: colors.success }]}>
                  {feature.premium}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={[styles.pricingCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
            LIFETIME ACCESS
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>{PRICE}</Text>
            <Text style={[styles.pricePeriod, { color: colors.textSecondary }]}>
              {PRICE_PERIOD}
            </Text>
          </View>
          <Text style={[styles.priceNote, { color: colors.success }]}>
            🎉 No subscription • Pay once, own forever
          </Text>
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[styles.purchaseButton, { opacity: isLoading ? 0.7 : 1 }]}
          onPress={handlePurchase}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <MaterialIcons name="lock-open" size={22} color="#fff" />
          <Text style={styles.purchaseText}>
            {isLoading ? 'Processing...' : 'Unlock Premium'}
          </Text>
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isLoading}
        >
          <Text style={[styles.restoreText, { color: colors.primary }]}>
            Restore Purchase
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          Your support helps us keep improving HabitCue!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  title: {
    fontSize: 26,
    fontFamily: FONT.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.regular,
    marginTop: SPACING.xs,
  },
  featuresContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: FONT.semibold,
  },
  featureDesc: {
    fontSize: 12,
    fontFamily: FONT.regular,
    marginTop: 2,
  },
  featureComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  freeLabel: {
    fontSize: 10,
    fontFamily: FONT.semibold,
  },
  premiumLabel: {
    fontSize: 10,
    fontFamily: FONT.bold,
  },
  pricingCard: {
    padding: SPACING.xxl,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: FONT.semibold,
    letterSpacing: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
    marginVertical: SPACING.sm,
  },
  price: {
    fontSize: 40,
    fontFamily: FONT.bold,
  },
  pricePeriod: {
    fontSize: 16,
    fontFamily: FONT.medium,
  },
  priceNote: {
    fontSize: 14,
    fontFamily: FONT.semibold,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    ...SHADOW.md,
  },
  purchaseText: {
    color: '#1a1a1a',
    fontSize: 17,
    fontFamily: FONT.bold,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  restoreText: {
    fontSize: 15,
    fontFamily: FONT.semibold,
  },
  footer: {
    fontSize: 12,
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  // Premium active styles
  premiumActiveContent: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  premiumBadge: {
    marginTop: 40,
    marginBottom: SPACING.xl,
  },
  premiumTitle: {
    fontSize: 26,
    fontFamily: FONT.bold,
  },
  premiumSubtitle: {
    fontSize: 15,
    fontFamily: FONT.regular,
    marginTop: SPACING.sm,
  },
  purchaseDate: {
    fontSize: 14,
    fontFamily: FONT.regular,
    marginTop: SPACING.xs,
  },
  featuresUnlocked: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    marginTop: SPACING.xxxl,
    gap: SPACING.md,
  },
  unlockedTitle: {
    fontSize: 16,
    fontFamily: FONT.bold,
    marginBottom: SPACING.sm,
  },
  unlockedFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  unlockedText: {
    fontSize: 15,
    fontFamily: FONT.medium,
  },
});

export default PremiumScreen;
