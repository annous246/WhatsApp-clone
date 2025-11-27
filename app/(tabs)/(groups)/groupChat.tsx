import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { deleteMessage, getchat } from "@/app/services/group";
import { AuthContext } from "@/app/context/AuthProvider";
import Message from "../(contacts)/Message";
import Controller from "../(contacts)/Controller";
import GroupController from "./groupController";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
type RootStackParamList = {
  home: undefined;
  groupchat: { groupId: string; groupName: string }; // changed here
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, "groupchat">;

export interface messageType {
  id: string;
  message: string;
  me: boolean;
  username?: string;
  date?: string;
  type?: string;
}
const GroupChat = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { groupId } = route.params;
  const { groupName } = route.params;

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const unsubscribe = useRef<any>(null);

  const [messages, setMessages] = useState<messageType[]>([]);

  useEffect(() => {
    if (groupId) {
      unsubscribe.current = getchat(user.uid, groupId, setMessages);
    }
  }, [groupId]);
  useEffect(() => {
    console.log(groupName);
    navigation.setOptions({ title: groupName + " Group" });
  }, [groupName]);

  useEffect(() => {
    return () => {
      if (unsubscribe.current) return unsubscribe.current();
    };
  }, []);

  async function handleDelete(messageId: string, me: boolean) {
    if (!messageId || !me) return;
    const res = await deleteMessage(messageId);
    if (!res) {
      console.log("error deleting message");
    }
  }

  return (
    <View style={{ height: "100%" }}>
      <ScrollView
        style={{
          padding: 20,
          maxHeight: "90%",
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            me={message.me}
            username={message.username}
            date={message.date}
            type={message.type}
            id={message.id}
            deleteMessage={() => handleDelete(message.id, message.me)}
          />
        ))}
      </ScrollView>

      <GroupController groupId={groupId} />
    </View>
  );
};

export default GroupChat;

const styles = StyleSheet.create({});
