import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

const Icon = ({ focused, icon, size, color, name }) => {
  return (
    <View style={styles.icon}>
      <Ionicons name={icon} size={size} color={color} />
      <Text style={focused ? styles.foctext : styles.text}>{name}</Text>
    </View>
  );
};
export default Icon;

const styles = StyleSheet.create({
  icon: {
    marginTop: "30%",
    height: "130%",
    alignItems: "center",
    flexDirection: "column",
  },
  text: {
    fontFamily: "sans-serif",
    fontSize: 10,
    margin: 0,
    width: "100%",
    color: "#0b0909",
    fontWeight: "bold",
  },
  foctext: {
    fontFamily: "sans-serif",
    fontSize: 10,
    margin: 0,
    width: "100%",
    color: "#46f28b",
    fontWeight: "bold",
  },
});
