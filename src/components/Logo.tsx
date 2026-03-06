import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FONT, RADIUS, SHADOW } from '../constants/theme';

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
            backgroundColor: '#7c3aed',
          },
          SHADOW.lg,
        ]}
      >
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
            Habit<Text style={{ color: '#7c3aed' }}>Cue</Text>
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
    overflow: 'hidden',
  },
  title: {
    fontFamily: FONT.bold,
    letterSpacing: -0.5,
  },
});

export default Logo;
