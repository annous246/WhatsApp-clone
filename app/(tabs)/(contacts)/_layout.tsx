import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./home";
import Chat from "./(ChatStack)/chat";
import ChatLayout from "./(ChatStack)/_layout";
import { useRoute } from "@react-navigation/native";

type RootStackParamList = {
  home: undefined;
  ChatLayout: { id: string; username: string };
};
const ContactsLayout = () => {
  const route = useRoute<any>();

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Home}
        name="home"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatLayout"
        component={ChatLayout}
        initialParams={{
          id: route.params?.id,
          username: route.params?.username,
        }}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ContactsLayout;

const styles = StyleSheet.create({});
