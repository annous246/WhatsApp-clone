import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { RouteProp, useRoute } from "@react-navigation/native";
import Message from "./Message";
import Controller from "./Controller";
import { getchat } from "@/app/services/messagerie";
import { AuthContext } from "@/app/context/AuthProvider";

type RootStackParamList = {
  home: undefined;
  chat: { id: string };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, "chat">;

export interface messageType {
  message: string;
  me: boolean;
}
const Chat = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { id } = route.params;
  const AuthSettings = useContext(AuthContext);
  const user = AuthSettings.user;
  useEffect(() => {
    console.log("id");
    console.log(id);
  }, [id]);
  useEffect(() => {
    const unsubscribe = getchat(user.id, id, setMessages);

    return () => {
      if (unsubscribe) return unsubscribe();
    };
  }, []);
  const [messages, setMessages] = React.useState<messageType[]>([]);

  return (
    <View style={{ height: "100%" }}>
      <ScrollView style={{ padding: 20 }}>
        <Text>{id}</Text>
        {messages.map((message) => (
          <Message message={message.message} me={message.me} />
        ))}
      </ScrollView>

      <Controller setMessages={setMessages} receiverId={id} />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
