import {
  Button,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useContext, useState } from "react";
import { messageType } from "./chat";
import { sendMessage } from "@/app/services/messagerie";
import { AuthContext } from "@/app/context/AuthProvider";

type ControllerProps = {
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  receiverId: string;
};

const Controller = ({ setMessages, receiverId }: ControllerProps) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const AuthSettings = useContext(AuthContext);
  const user = AuthSettings.user;
  const send = async () => {
    if (currentMessage.trim() === "") return; // avoid sending empty messages
    console.log(currentMessage);
    const res = await sendMessage(user.uid, receiverId, currentMessage.trim());
    if (res) {
      setCurrentMessage("");
      console.log("sent ");
    } else {
      //error
    }
  };

  const sendLocation = () => {
    // Empty functionality placeholder
    console.log("Send location pressed");
  };

  const sendPicture = () => {
    // Empty functionality placeholder
    console.log("Send picture pressed");
  };

  return (
    <View style={styles.container}>
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

export default Controller;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
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
});
