import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import icons from "../constants/icons";
interface profileButtonPropsType {
  title: string;
  icon: any;
  onPress: () => void;
}
const ProfileButton = (props: profileButtonPropsType) => {
  const title = props.title;
  const icon = props.icon;
  const onPress = props.onPress;
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "75%",
        backgroundColor: "white",
        height: 50,
        overflow: "hidden",
        alignSelf: "center",
        marginVertical: 20,
        borderRadius: 7,
        elevation: 4, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
      onPress={onPress}
    >
      <Image style={{ height: 30, width: 30, marginLeft: 15 }} source={icon} />
      <Text
        style={{
          fontSize: 15,
          color: "black",
          width: "80%",
          textAlign: "right",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ProfileButton;

const styles = StyleSheet.create({});
