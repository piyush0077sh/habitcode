import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface AnimatedPressableProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  scaleDown?: number;
  duration?: number;
  children: React.ReactNode;
}

const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  style,
  scaleDown = 0.96,
  duration = 120,
  onPressIn,
  onPressOut,
  children,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (e: any) => {
      Animated.spring(scaleAnim, {
        toValue: scaleDown,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
      onPressIn?.(e);
    },
    [scaleAnim, scaleDown, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 6,
      }).start();
      onPressOut?.(e);
    },
    [scaleAnim, onPressOut]
  );

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedPressable;
