import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import icons from "../constants/icons";
import { text } from "body-parser";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import Home from "./(contacts)/home";
import Profile from "./(profile)/_layout";
import Icon from "../components/Icon";
import {
  getFocusedRouteNameFromRoute,
  useNavigationState,
} from "@react-navigation/native";
import ContactsLayout from "./(contacts)/_layout";
const Tabs = createBottomTabNavigator();
const TabsLayout = () => {
  const state = useNavigationState((state) => state); // full navigation state
  const currentTabIndex = state.index; // index of active ta
  const currentTab = state.routes[0]["state"] ?? { index: 0 };
  useEffect(() => {
    console.log("currently");
    console.log(currentTab);
  }, [currentTab]);
  const NoComp = () => null;
  return (
    <>
      <Tabs.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: "#46f28b",
          tabBarInactiveTintColor: "#CFB1B7",
          tabBarStyle: { backgroundColor: "white" },
        }}
      >
        <Tabs.Screen
          name="(contacts)"
          component={ContactsLayout}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            return {
              tabBarStyle: routeName === "chat" ? { display: "none" } : {},
              title: "(contacts)",
              headerShown: false,

              tabBarIcon: ({ size, focused, color }) => {
                return (
                  <Icon
                    focused={focused}
                    icon="people"
                    name="Friends"
                    size={size}
                    color={color}
                  />
                );
              },
            };
          }}
        />

        <Tabs.Screen
          name="(profile)"
          component={Profile}
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Icon
                  focused={focused}
                  icon="person"
                  name="Profile"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
      </Tabs.Navigator>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  image: {
    width: 10,
    height: "100%",
  },
});
