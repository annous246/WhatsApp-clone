import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";

const AnimatedBar = ({
  pagination: pagination,
  value: value,
  height: height,
  measurement: measurement,
  title: title,
}: {
  pagination: number;
  height: number;
  value: number;
  title: string;
  measurement: string;
}) => {
  const heightUp = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (pagination + 1 == value) {
      console.log("go");
      Animated.timing(heightUp, {
        useNativeDriver: false,
        duration: 500,
        toValue: 1,
      }).start();
    } else {
      console.log("pagination 2");
      console.log(pagination + 1);
      console.log(value);
      console.log("value");
      Animated.timing(heightUp, {
        useNativeDriver: false,
        duration: 300,
        toValue: 0,
      }).start();
    }
  }, [pagination]);
  const HeightAnimated = heightUp.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {title} {"\n"} {height} {measurement}
      </Text>
      <View
        style={{
          height: "80%",
          width: 20,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Animated.View
          style={{
            backgroundColor: "#374bff",
            height: HeightAnimated,
            width: 20,
            borderRadius: 5,
          }}
        ></Animated.View>
      </View>
    </View>
  );
};

export default AnimatedBar;

const styles = StyleSheet.create({
  text: {
    height: "10%",
    overflow: "hidden",
    textAlign: "center",
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    width: "15%",
  },
});
