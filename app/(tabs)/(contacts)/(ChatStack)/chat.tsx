import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Message from "../Message";
import Controller from "../Controller";
import { deleteMessage, editMessage, getchat } from "@/app/services/messagerie";
import { AuthContext } from "@/app/context/AuthProvider";
import { notificationContext } from "@/app/context/NotificationProvider";
import icons from "@/app/constants/icons";
import { getUser } from "@/app/services/user";
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
type RootStackParamList = {
  chat: { id: string; username: string };
  sections: { chat: string; otherId: string };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, "chat">;

export interface messageType {
  id: string;
  message: string;
  me: boolean;
  username?: string;
  date?: string;
  type?: string;
}
const Chat = () => {
  const [messages, setMessages] = React.useState<messageType[]>([]);
  const route = useRoute<ChatScreenRouteProp>();
  const { id } = route.params;
  const { username } = route.params;
  const AuthSettings = useContext(AuthContext);
  const user = AuthSettings.user;
  const unsubscribe = useRef<any>(null);
  const navigation = useNavigation();
  const NotificationSettings = useContext(notificationContext);
  const [otherIsTyping, setOtherIsTyping] = useState<boolean>(false);
  const [otherUser, setOtherUser] = useState<any>(null);

  const scroller = useRef<any>(null);
  useEffect(() => {
    console.log(username);
    navigation.setOptions({ title: username });
  }, [username]);
  useEffect(() => {
    scroller.current?.scrollToEnd({ animated: true });
  }, [messages]);
  useEffect(() => {
    if (id) {
      getOtherUser();
      unsubscribe.current = getchat(user.uid, id, setMessages);
    }
  }, [id]);
  async function getOtherUser() {
    const currentOtherUser = await getUser(id);
    if (currentOtherUser) {
      setOtherUser(currentOtherUser);
    } else {
      console.log("error loading other user");
      NotificationSettings.notify("error loading other user", 2);
    }
  }
  useEffect(() => {
    scroller.current?.scrollToEnd({ animated: true });
    return () => {
      if (unsubscribe.current) return unsubscribe.current();
    };
  }, []);

  async function handleDelete(messageId: string, me: boolean) {
    if (!messageId || !me) return;
    const res = await deleteMessage(messageId);
    if (!res) {
      console.log("error deleting message");
      return NotificationSettings.notify("error Deleting Message ", 2);
    }
    NotificationSettings.notify("Message Deleted", 0);
  }
  async function handleEdit(
    messageId: string,
    me: boolean,
    newMessage: string
  ) {
    if (!messageId || !me) return;
    const res = await editMessage(messageId, newMessage);
    if (!res) {
      console.log("error deleting message");
      return NotificationSettings.notify("error Editing Message ", 2);
    }
    NotificationSettings.notify("Message Edited", 0);
  }
  return (
    <View style={{ height: "100%" }}>
      <ScrollView
        ref={scroller}
        style={{
          padding: 20,
          maxHeight: "90%",
        }}
      >
        {/* <Text>{id}</Text> */}
        {messages.map((message, index) => (
          <Message
            id={message.id}
            imageLink={message.me ? user.image : otherUser?.image}
            key={index}
            message={message.message}
            me={message.me}
            date={message.date}
            username={message.username}
            type={message.type}
            deleteMessage={() => handleDelete(message.id, message.me)}
            editMessage={(newMessage: string) =>
              handleEdit(message.id, message.me, newMessage)
            }
          />
        ))}
        {otherIsTyping && "TYPING ................"}
      </ScrollView>

      <Controller
        receiverUsername={username}
        setMessages={setMessages}
        receiverId={id}
        setOtherIsTyping={setOtherIsTyping}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
