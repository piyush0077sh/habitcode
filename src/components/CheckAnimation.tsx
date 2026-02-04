import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CheckAnimationProps {
  visible: boolean;
  color: string;
  size?: number;
  onComplete?: () => void;
}

export const CheckAnimation: React.FC<CheckAnimationProps> = ({ 
  visible, 
  color, 
  size = 24,
  onComplete 
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset values
      scale.setValue(0);
      opacity.setValue(0);
      rotate.setValue(-0.5);

      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.2,
            friction: 3,
            tension: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale },
            {
              rotate: rotate.interpolate({
                inputRange: [-0.5, 0],
                outputRange: ['-45deg', '0deg'],
              }),
            },
          ],
          opacity,
        },
      ]}
    >
      <MaterialIcons name="check" size={size} color={color} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
