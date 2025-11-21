import { StyleSheet, Text, View } from "react-native";
import React from "react";
interface spannerPropsType {
  label?: string;
  value?: string;
}
const Spanner = (props: spannerPropsType) => {
  const label = props.label;
  const value = props.value;
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Text style={{ fontSize: 10, color: "#929292" }}>{label}</Text>
      <Text style={{ fontSize: 10, color: "#b7b7b7" }}>{value}</Text>
    </View>
  );
};

export default Spanner;

const styles = StyleSheet.create({});
