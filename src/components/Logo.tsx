import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const { colors } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return { icon: 24, container: 40, fontSize: 16, gap: 8 };
      case 'medium':
        return { icon: 32, container: 56, fontSize: 22, gap: 12 };
      case 'large':
        return { icon: 48, container: 80, fontSize: 32, gap: 16 };
    }
  };

  const dimensions = getSize();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            width: dimensions.container,
            height: dimensions.container,
            borderRadius: dimensions.container * 0.28,
          },
        ]}
      >
        {/* Background gradient effect */}
        <View style={[styles.gradientBg, styles.gradientPurple]} />
        <View style={[styles.gradientBg, styles.gradientPink]} />
        
        {/* Icon */}
        <MaterialIcons
          name="track-changes"
          size={dimensions.icon}
          color="#fff"
        />
      </View>
      
      {showText && (
        <View style={{ marginLeft: dimensions.gap }}>
          <Text
            style={[
              styles.title,
              { fontSize: dimensions.fontSize, color: colors.text },
            ]}
          >
            Habit<Text style={{ color: colors.primary }}>Cue</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientPurple: {
    backgroundColor: '#7c3aed',
  },
  gradientPink: {
    backgroundColor: '#ec4899',
    opacity: 0.3,
    transform: [{ rotate: '45deg' }, { scale: 1.5 }],
    top: '50%',
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});

export default Logo;
