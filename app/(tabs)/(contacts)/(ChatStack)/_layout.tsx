import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chat from "./chat";
import GroupChat from "../../(groups)/groupChat";
import SectionLayout from "./(sections)/_layout";
import {
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";

type RootStackParamList = {
  chat: { id: string; username: string };
  sections: { id: string };
};
const ChatLayout = () => {
  const route = useRoute<any>();

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Chat}
        name="chat"
        initialParams={{
          id: route.params?.id,
          username: route.params?.username,
        }}
        options={({ navigation }) => ({
          title: route.params?.username,
          headerRight: () => (
            <Text
              style={{ marginRight: 12, fontSize: 18 }}
              onPress={() => {
                console.log(route.params);
                navigation.navigate("sections", {
                  id: route.params?.id,
                });
              }}
            >
              ...
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="sections"
        component={SectionLayout}
        initialParams={{ id: route.params?.id }}
        options={({ route }) => {
          // Get the currently focused tab name
          const routeName = getFocusedRouteNameFromRoute(route) ?? "locations";

          return {
            headerShown: true,
            title: routeName, // <-- dynamic title based on active tab
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatLayout;

const styles = StyleSheet.create({});
