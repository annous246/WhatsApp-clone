import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import icons from "../constants/icons";
const NotificationBar = ({
  type,
  message,
  setPopup,
  popup,
}: {
  type: number;
  message: string;
  popup: boolean;
  setPopup: any;
}) => {
  const opacityAnimation = useSharedValue(0);
  const color = type == 0 ? "#4BAE4F" : type == 1 ? "#FFC048" : "#F74850";
  const icon = type == 0 ? "successful" : type == 1 ? "warning" : "error";
  useEffect(() => {
    opacityAnimation.value = withTiming(popup ? 1 : 0, { duration: 100 });
  }, [popup]);

  const animation = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation.value,
    };
  });
  function dismiss() {
    setPopup(false);
  }
  return (
    <Animated.View
      style={[
        {
          ...styles.container,
          alignItems: "center",
          width: "100%",
          height: 75,
          padding: 5,
          zIndex: 25000000,
        },
        animation,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "80%",
          height: "100%",
          backgroundColor: "white",
          borderRadius: 17,
          paddingVertical: 10,
          paddingInline: 8,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: color,
        }}
      >
        <Image
          source={icons[icon]}
          style={{
            width: 20,
            marginRight: 10,
            marginTop: 3,
            marginLeft: 3,
            height: 20,
          }}
        />
        <Text
          style={{
            fontSize: 13,
            fontWeight: "bold",
            width: "65%",
          }}
        >
          {message.slice(0, 51).concat(!(message.length > 50) ? "." : "...")}
        </Text>
        <TouchableOpacity
          style={{
            borderRadius: 17,
            backgroundColor: color,
            alignSelf: "center",
            height: "90%",
            padding: 5,
            paddingInline: 10,
            alignContent: "center",
            justifyContent: "center",
            margin: "auto",
          }}
          onPress={dismiss}
        >
          <Text
            style={{
              color: "white",
              fontSize: 12,
            }}
          >
            Dismiss
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default NotificationBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "0%",
    left: "0%",
  },
});
