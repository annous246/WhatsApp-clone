import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useRef } from "react";

const ToggleButton = ({
  mode1: mode1,
  mode2: mode2,
  status: status,
  setStatus: setStatus,
}: {
  mode1: string;
  mode2: string;
  status: boolean;
  setStatus: any;
}) => {
  const leftAnimate = useRef(new Animated.Value(0)).current;
  const fullAnimation = leftAnimate.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 73],
  });
  function handleToggle() {
    if (status)
      Animated.timing(leftAnimate, {
        useNativeDriver: false,
        toValue: 100,
        duration: 200,
      }).start();
    else
      Animated.timing(leftAnimate, {
        useNativeDriver: false,
        toValue: 0,
        duration: 200,
      }).start();
    setStatus((prev: boolean) => !prev);
  }
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.md}>{mode1}</Text>
        <Text style={styles.md}>{mode2}</Text>
      </View>
      <TouchableOpacity onPress={handleToggle} style={styles.toggle}>
        <Animated.View
          style={{
            ...styles.button,
            transform: [{ translateX: fullAnimation }],
          }}
        ></Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
  },
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggle: {
    position: "relative",
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    height: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 5,
    paddingInline: 3,
    overflow: "hidden",
  },
  md: { fontSize: 10 },
  button: {
    backgroundColor: "black",
    height: 15,
    width: 15,
    borderRadius: 500,
  },
});
export default ToggleButton;
