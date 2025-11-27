import {
  Button,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useContext, useState } from "react";
import { messageType } from "./groupChat";
import { leaveGroup, sendMessage } from "@/app/services/group";
import { AuthContext } from "@/app/context/AuthProvider";
import {
  checkLocationPermission,
  getCurrentLocationLink,
} from "@/app/services/user";
import { pickAndUploadImage } from "@/app/services/image";
import { notificationContext } from "@/app/context/NotificationProvider";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ControllerProps = {
  groupId: string;
};
type RootStackParamList = {
  groups: undefined;
  group_chat: { groupId: string; groupName: string };
};

type NavProp = NativeStackNavigationProp<RootStackParamList, "groups">;

const GroupController = ({ groupId }: ControllerProps) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const AuthSettings = useContext(AuthContext);
  const NotificationSettings = useContext(notificationContext);
  const user = AuthSettings.user;

  const navigation = useNavigation<NavProp>();
  const send = async () => {
    if (currentMessage.trim() === "" || !groupId) return; // avoid sending empty messages
    console.log(currentMessage);
    const res = await sendMessage(
      user.uid,
      groupId,
      currentMessage.trim(),
      user.username,
      "message"
    );
    // await sendMessage("O8cZCNHyiDSQijXsJEWKNU0dxkk1", groupId, "yes", "anas");
    // await sendMessage(
    //   "HvXifu2hvoRwFAPRg7k73JDfi6s2",
    //   groupId,
    //   "not really",
    //   "anash"
    // );
    if (res) {
      setCurrentMessage("");
      console.log("sent in group ");
    } else {
      //error
      console.log("error sending in group chat");
    }
  };

  const sendLocation = async () => {
    // Empty functionality placeholder
    try {
      const res = await checkLocationPermission();
      if (res) {
        //all good
        const location = await getCurrentLocationLink();
        if (location) {
          const messageRes = await sendMessage(
            user.uid,
            groupId,
            location,
            user.username,
            "location"
          );
          if (messageRes) {
            console.log("location sent");
          } else {
            console.log("error sending location");
          }
          return;
        }
        throw Error("cant get current location");
      } else {
        console.log("We need location permission");
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const sendPicture = async () => {
    // Empty functionality placeholder
    const imageUrl = await pickAndUploadImage();
    if (imageUrl && imageUrl.length) {
      await sendMessage(user.uid, groupId, imageUrl, user.username, "image");
    }
  };
  async function leave() {
    const res = await leaveGroup(user.uid, groupId);
    if (res) {
      navigation.navigate("groups");
      return NotificationSettings.notify("left the group", 0);
    }
    NotificationSettings.notify("error leaving the group", 2);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={leave}>
        <Text style={styles.leaveText}>🚪 Leave</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={sendLocation}>
        <Text style={styles.iconText}>📍</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={currentMessage}
        onChangeText={setCurrentMessage}
        placeholder="Type a message..."
      />

      <TouchableOpacity style={styles.iconButton} onPress={sendPicture}>
        <Text style={styles.iconText}>📷</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sendButton} onPress={send}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GroupController;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    height: "10%",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendText: {
    color: "white",
    fontWeight: "600",
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconText: {
    fontSize: 20,
  },
  leaveText: {
    fontSize: 10,
  },
});
