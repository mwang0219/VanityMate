import React, { forwardRef } from 'react';
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

const SwipeableRowComponent = forwardRef<Swipeable, SwipeableRowProps>(({ children, rightActions }, ref) => {
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
            onPress={action.onPress}
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
    <GestureHandlerRootView style={styles.container}>
      <Swipeable
        ref={ref}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={renderRightActions}
        containerStyle={styles.swipeableContainer}
      >
        <View style={styles.cardContainer}>
          {children}
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
});

SwipeableRowComponent.displayName = 'SwipeableRow';

export const SwipeableRow = SwipeableRowComponent;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  swipeableContainer: {
    backgroundColor: 'transparent',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android 阴影
    marginVertical: 6, // 添加垂直间距
  },
  rightActionsContainer: {
    width: 80,
    flexDirection: 'row',
    marginRight: 10,
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