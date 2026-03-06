import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';

interface ConfettiAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

const CONFETTI_COUNT = 30;
const COLORS = ['#818cf8', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#06b6d4'];

interface ConfettiPiece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ visible, onComplete }) => {
  const { width, height } = useWindowDimensions();
  const confettiPieces = useRef<ConfettiPiece[]>(
    Array.from({ length: CONFETTI_COUNT }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 10 + 6,
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      startAnimation();
    }
  }, [visible]);

  const startAnimation = () => {
    const animations = confettiPieces.map((piece) => {
      // Reset values
      piece.x.setValue(width / 2);
      piece.y.setValue(height / 2);
      piece.rotate.setValue(0);
      piece.opacity.setValue(1);

      const randomX = Math.random() * width;
      const randomDelay = Math.random() * 200;

      return Animated.sequence([
        Animated.delay(randomDelay),
        Animated.parallel([
          Animated.timing(piece.x, {
            toValue: randomX,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(piece.y, {
            toValue: height + 50,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotate, {
            toValue: Math.random() * 10 - 5,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onComplete?.();
    });
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              width: piece.size,
              height: piece.size * 1.5,
              backgroundColor: piece.color,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotate.interpolate({
                    inputRange: [-5, 5],
                    outputRange: ['-180deg', '180deg'],
                  }),
                },
              ],
              opacity: piece.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});
