import { StyleSheet, Text, View } from "react-native";
import React from "react";
interface linePropsType {
  width: string | number;
  height: string | number;
  marginBottom: string | number;
  marginTop: string | number;
  backgroundColor?: string;
}
const Line = (props: linePropsType) => {
  const height = props.height ?? 0;
  const width = props.width ?? 0;
  const marginTop = props.marginTop;
  const marginBottom = props.marginBottom;
  const backgroundColor = props.backgroundColor;
  return (
    <View
      style={{
        position: "relative",
        backgroundColor: backgroundColor ?? "gray",
        height: height,
        width: width,
        marginTop: marginTop,
        marginBottom: marginBottom,
      }}
    ></View>
  );
};

export default Line;

const styles = StyleSheet.create({});
