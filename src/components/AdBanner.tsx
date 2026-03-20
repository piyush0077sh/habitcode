import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';
import { FONT, RADIUS, SPACING } from '../constants/theme';

interface AdBannerProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
}

const AdBanner: React.FC<AdBannerProps> = ({ size = 'banner' }) => {
  const { colors } = useTheme();
  const { isPremium } = usePremium();

  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }

  const getAdHeight = () => {
    switch (size) {
      case 'banner':
        return 50;
      case 'largeBanner':
        return 100;
      case 'mediumRectangle':
        return 250;
      default:
        return 50;
    }
  };

  // In Expo Go, show a placeholder ad
  // In production with dev build, this would show real AdMob ads
  return (
    <View
      style={[
        styles.container,
        {
          height: getAdHeight(),
          backgroundColor: colors.surfaceVariant,
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={styles.adContent}>
        <Text style={[styles.adLabel, { color: colors.textSecondary }]}>
          AD
        </Text>
        <Text style={[styles.adText, { color: colors.textSecondary }]}>
          Upgrade to Premium to remove ads
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  adLabel: {
    fontSize: 10,
    fontFamily: FONT.semibold,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.sm / 2,
    backgroundColor: 'rgba(120, 120, 120, 0.12)',
    overflow: 'hidden',
  },
  adText: {
    fontSize: 12,
    fontFamily: FONT.regular,
  },
});

export default AdBanner;

// Note: For production, replace this component with real AdMob integration:
/*
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ 
  ? TestIds.BANNER 
  : Platform.OS === 'ios'
    ? 'ca-app-pub-xxxxx/yyyyy'  // Your iOS ad unit ID
    : 'ca-app-pub-xxxxx/zzzzz'; // Your Android ad unit ID

<BannerAd
  unitId={adUnitId}
  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  requestOptions={{
    requestNonPersonalizedAdsOnly: true,
  }}
/>
*/
