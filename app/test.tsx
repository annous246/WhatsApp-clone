import React from "react";
import { View, Text } from "react-native";
import { BlurView } from "@react-native-community/blur";

export default function TestBlur() {
  return (
    <View style={{ flex: 1, backgroundColor: "gray" }}>
      <BlurView style={{ flex: 1 }} blurType="light" blurAmount={10} />
      <Text style={{ position: "absolute", top: 50, left: 20 }}>
        Hello Blur
      </Text>
    </View>
  );
}
