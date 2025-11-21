import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Spanner from "./Spanner";
import Line from "./Line";
import icons from "../constants/icons";
import { AuthContext } from "../context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StepperContext } from "../context/StepperProvider";
import axios from "axios";
import { authLogout } from "../services/auth";
import { router } from "expo-router";
import { notificationContext } from "../context/NotificationProvider";

const IntroPanel = () => {
  const AuthSettings = useContext(AuthContext);
  const StepperSettings = useContext(StepperContext);
  const NotificationSettings = useContext(notificationContext);
  const user = AuthSettings.user ?? {};

  async function logout() {
    const res = await authLogout();
    /*
    AuthSettings.setUser(null);
    AuthSettings.setUserToken(null);*/
    //  StepperSettings.setStepper(null);
    if (res) {
      router.push("/(auth)/sign-in");
      NotificationSettings.notify("Logged Out", 0);
    }
  }
  return (
    <>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: 20,
          marginTop: 20,
          position: "relative",
          zIndex: 10,
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 25,
            fontFamily: "Sans-Serrif",
            top: "10%",
            left: "5%",
          }}
        >
          Profile
        </Text>
        <TouchableOpacity
          onPress={logout}
          style={{
            top: "10%",
            right: "5%",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 100,
              padding: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "black",
            }}
          >
            <Image
              source={icons.logout}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "white",
          width: "90%",
          alignSelf: "center",
          borderRadius: 10,
          overflow: "hidden",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          elevation: 4, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderRadius: 100,
            overflow: "hidden",
          }}
        >
          <Image
            source={icons.person}
            style={{
              width: 50,
              height: 50,
              margin: 20,
              padding: 50,
              borderRadius: 100,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            width: "50%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 25,
              top: "5%",
              position: "relative",
            }}
          >
            {user.username}
          </Text>
        </View>
      </View>
    </>
  );
};

export default IntroPanel;

const styles = StyleSheet.create({});
