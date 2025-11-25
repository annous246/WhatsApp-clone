import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./home";
import Chat from "./chat";
type RootStackParamList = {
  home: undefined;
  chat: { id: string };
};
const ContactsLayout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Home}
        name="home"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={Chat}
        name="chat"
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default ContactsLayout;

const styles = StyleSheet.create({});
