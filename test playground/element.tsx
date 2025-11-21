import React from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export const SwipeableTab = ({ title, onRemove }) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      // Only allow horizontal movement if the initial gesture was horizontal
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        translateX.value = ctx.startX + event.translationX;
      }
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { duration: 300 }
        );
        opacity.value = withTiming(0, { duration: 300 }, (isFinished) => {
          if (isFinished) {
            runOnJS(onRemove)();
          }
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      activeOffsetX={[-10, 10]} // Only activate if horizontal movement is detected
      failOffsetY={[-10, 10]} // Fail if vertical movement is detected (allows parent to handle vertical scrolling)
    >
      <Animated.View style={[styles.tab, animatedStyle]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  tab: {
    width: "90%",
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
