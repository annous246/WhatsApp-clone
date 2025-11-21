import { StyleSheet, Text, View } from "react-native";
import React from "react";

const VerticalLine = ({
  width,
  height,
  color,
  marginInline,
}: {
  width: any;
  height: any;
  marginInline: any;
  color: string;
}) => {
  return (
    <View
      style={{
        width: width + 2 * marginInline, // total width including marginInline
        height: height,
        justifyContent: "center", // vertical centering
        alignItems: "center", // horizontal centering
      }}
    >
      <View
        style={{
          position: "absolute",
          width: width,
          height: "100%",
          backgroundColor: color,
          borderRadius: 100,
        }}
      />
    </View>
  );
};

export default VerticalLine;

const styles = StyleSheet.create({});
