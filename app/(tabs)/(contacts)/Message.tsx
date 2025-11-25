import { StyleSheet, Text, View } from "react-native";
import React from "react";

type MessageProps = {
  message: string;
  me: boolean;
};

const Message = ({ message, me }: MessageProps) => {
  return (
    <View
      style={[
        styles.container,
        me ? styles.meContainer : styles.otherContainer,
      ]}
    >
      <Text style={[styles.text, me ? styles.meText : styles.otherText]}>
        {message}
      </Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  meContainer: {
    backgroundColor: "#007AFF", // blue bubble
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  otherContainer: {
    backgroundColor: "#E5E5EA", // gray bubble
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  text: {
    fontSize: 16,
  },
  meText: {
    color: "white",
  },
  otherText: {
    color: "black",
  },
});
