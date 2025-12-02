import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

// const Icon = ({ focused, icon, size, color, name }) => {
//   return (
//     <View style={styles.icon}>
//       <Ionicons name={icon} size={size} color={color} />
//       <Text style={focused ? styles.foctext : styles.text}>{name}</Text>
//     </View>
//   );
// };
// // components/Icon.js

const Icon = ({ focused, icon, name, size, color }) => {
  // Original Ionicons return commented out
  // return <Ionicons name={icon} size={size} color={color} />;

  // Replace with emoji according to "name"
  let emoji = "";
  switch (name) {
    case "Friends":
      emoji = "👥";
      break;
    case "create group":
      emoji = "➕";
      break;
    case "group chats":
      emoji = "👥";
      break;
    case "Profile":
      emoji = "👤";
      break;
    case "Location":
      emoji = "📍"; // (or "🌍" / "🗺️")
      break;
    case "Media":
      emoji = "🖼️"; // (or "📷" / "🎬" / "📸")
      break;

    default:
      emoji = "❓";
  }

  return (
    <View style={styles.icon}>
      <Text style={{ fontSize: size - 13 }}>
        {focused ? `🟢${emoji}` : emoji}
      </Text>
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
