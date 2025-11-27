import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./groups";
import Chat from "./groupChat";
import GroupsList from "./groups";
import GroupChat from "./groupChat";
type RootStackParamList = {
  groups: undefined;
  group_chat: { groupId: string; groupName: string };
};
const GroupsLayout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={GroupsList}
        name="groups"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={GroupChat}
        name="group_chat"
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default GroupsLayout;

const styles = StyleSheet.create({});
