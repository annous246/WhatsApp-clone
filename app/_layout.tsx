import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Slot, Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import AuthLayout from "./(auth)/_layout";
import tabsLayout from "./(tabs)/_layout";
import index from "./index";

import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Main from "./main";
import { StepperProvider } from "./context/StepperProvider";
import { TabsProvider } from "./context/TabsProvider";
import { NotificationProvider } from "./context/NotificationProvider";
import NotificationView from "./context/NotificationView";
import { DateProvider } from "./context/DateProvider";
export default function RootLayout() {
  //!!!!!!!!!!!!!!! dont touch this code every (security measures)
  return (
    <DateProvider>
      <TabsProvider>
        <StepperProvider>
          <AuthProvider>
            <NotificationView />
            <NotificationProvider>
              <Main />
            </NotificationProvider>
          </AuthProvider>
        </StepperProvider>
      </TabsProvider>
    </DateProvider>
  );
}
