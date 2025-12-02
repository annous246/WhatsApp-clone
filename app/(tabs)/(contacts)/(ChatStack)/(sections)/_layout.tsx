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
import { text } from "body-parser";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import {
  getFocusedRouteNameFromRoute,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import Icon from "@/app/components/Icon";
import Locations from "./Locations";
import Media from "./Media";
const Tabs = createBottomTabNavigator();
const SectionLayout = () => {
  const state = useNavigationState((state) => state); // full navigation state
  const currentTab = state.routes[0]["state"] ?? { index: 0 };

  const route = useRoute<any>();
  const { id } = route.params;
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
          name="locations"
          component={Locations}
          initialParams={{ id }}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            return {
              title: "locations",
              headerShown: false,

              tabBarIcon: ({ size, focused, color }) => {
                return (
                  <Icon
                    focused={focused}
                    icon="people"
                    name="Locations"
                    size={size}
                    color={color}
                  />
                );
              },
            };
          }}
        />
        <Tabs.Screen
          name="media"
          component={Media}
          initialParams={{ id }}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            return {
              tabBarStyle: routeName === "chat" ? { display: "none" } : {},
              title: "create_group",
              headerShown: false,

              tabBarIcon: ({ size, focused, color }) => {
                return (
                  <Icon
                    focused={focused}
                    icon="add"
                    name="Media"
                    size={size}
                    color={color}
                  />
                );
              },
            };
          }}
        />
      </Tabs.Navigator>
    </>
  );
};

export default SectionLayout;

const styles = StyleSheet.create({
  image: {
    width: 10,
    height: "100%",
  },
});
