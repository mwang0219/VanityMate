import React, { useRef } from 'react';
import { Animated, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

interface SwipeableRowProps {
  children: React.ReactNode;
  rightActions?: SwipeAction[];
}

export interface SwipeAction {
  text: string;
  backgroundColor: string;
  onPress: () => void;
  textColor?: string;
}

export function SwipeableRow({ children, rightActions }: SwipeableRowProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    if (!rightActions?.length) return null;

    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <View style={styles.rightActionsContainer}>
        {rightActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={{ flex: 1 }}
            onPress={() => {
              action.onPress();
              swipeableRef.current?.close();
            }}
          >
            <Animated.View
              style={[
                styles.rightActionButton,
                {
                  backgroundColor: action.backgroundColor,
                  transform: [{ translateX: trans }],
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.actionText,
                  { color: action.textColor || '#fff' },
                ]}
              >
                {action.text}
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={renderRightActions}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rightActionsContainer: {
    width: 80,
    flexDirection: 'row',
  },
  rightActionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 