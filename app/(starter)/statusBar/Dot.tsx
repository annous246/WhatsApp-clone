import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";

const Dot = ({
  pagination: pagination,
  value: value,
}: {
  pagination: number;
  value: number;
}) => {
  const changeup = useRef(new Animated.Value(0)).current;
  const borderChange = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pagination + 1 == value) {
      Animated.timing(changeup, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(borderChange, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (pagination + 1 > value) {
      Animated.timing(changeup, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(borderChange, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(borderChange, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [pagination]);
  const backgroundAnimation = changeup.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "green"],
  });
  const borderAnimation = borderChange.interpolate({
    inputRange: [0, 1],
    outputRange: ["white", "black"],
  });
  return (
    <Animated.View
      style={{
        marginInline: 10,
        width: 10,
        height: 10,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: borderAnimation,
        backgroundColor: backgroundAnimation,
      }}
    ></Animated.View>
  );
};

export default Dot;
