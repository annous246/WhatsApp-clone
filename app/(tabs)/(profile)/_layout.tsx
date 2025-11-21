import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Terms from "./terms";

const ProfileLayout = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="terms"
        component={Terms}
        options={{
          headerShown: true,
          headerTitle: "Terms & Conditions",
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileLayout;

const styles = StyleSheet.create({});
