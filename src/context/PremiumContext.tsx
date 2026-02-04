import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = '@habitcode_premium';
const PURCHASE_DATE_KEY = '@habitcode_purchase_date';

interface PremiumFeatures {
  unlimitedHabits: boolean;
  noAds: boolean;
  advancedStats: boolean;
  allThemes: boolean;
  cloudBackup: boolean;
  customIcons: boolean;
}

interface PremiumContextType {
  isPremium: boolean;
  features: PremiumFeatures;
  purchaseDate: Date | null;
  upgradeToPremium: () => Promise<void>;
  restorePurchase: () => Promise<boolean>;
  checkFeature: (feature: keyof PremiumFeatures) => boolean;
  FREE_HABIT_LIMIT: number;
}

const FREE_FEATURES: PremiumFeatures = {
  unlimitedHabits: false,
  noAds: false,
  advancedStats: false,
  allThemes: false,
  cloudBackup: false,
  customIcons: false,
};

const PREMIUM_FEATURES: PremiumFeatures = {
  unlimitedHabits: true,
  noAds: true,
  advancedStats: true,
  allThemes: true,
  cloudBackup: true,
  customIcons: true,
};

const FREE_HABIT_LIMIT = 3;

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const premium = await AsyncStorage.getItem(PREMIUM_KEY);
      const dateStr = await AsyncStorage.getItem(PURCHASE_DATE_KEY);
      
      if (premium === 'true') {
        setIsPremium(true);
        if (dateStr) {
          setPurchaseDate(new Date(dateStr));
        }
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  const upgradeToPremium = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem(PREMIUM_KEY, 'true');
      await AsyncStorage.setItem(PURCHASE_DATE_KEY, now.toISOString());
      setIsPremium(true);
      setPurchaseDate(now);
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      throw error;
    }
  };

  const restorePurchase = async (): Promise<boolean> => {
    try {
      // In a real app, this would verify with the app store
      // For now, just check local storage
      const premium = await AsyncStorage.getItem(PREMIUM_KEY);
      if (premium === 'true') {
        setIsPremium(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring purchase:', error);
      return false;
    }
  };

  const checkFeature = (feature: keyof PremiumFeatures): boolean => {
    return isPremium ? PREMIUM_FEATURES[feature] : FREE_FEATURES[feature];
  };

  const features = isPremium ? PREMIUM_FEATURES : FREE_FEATURES;

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        features,
        purchaseDate,
        upgradeToPremium,
        restorePurchase,
        checkFeature,
        FREE_HABIT_LIMIT,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};
