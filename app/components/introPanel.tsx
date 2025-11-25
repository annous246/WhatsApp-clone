import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
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
import { savePhone, saveUsername } from "../services/user";

const IntroPanel = () => {
  const AuthSettings = useContext(AuthContext);
  const StepperSettings = useContext(StepperContext);
  const NotificationSettings = useContext(notificationContext);
  const user = AuthSettings.user ?? {};

  // STATES FOR EDITABLE FIELDS
  const [username, setUsername] = useState(user.username || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");

  async function saveProfile() {
    // EMPTY FUNCTION (you will implement later)
    console.log("Saving:", { username, phoneNumber });
    console.log(user);
    const res1 = await savePhone(phoneNumber, user.uid);
    const res2 = await saveUsername(username, user.uid);
    if (res1 && res2) {
      console.log("saved");
    } else {
      console.log("not saved");
    }
  }

  async function logout() {
    const res = await authLogout();
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
          elevation: 4,
          shadowColor: "#000",
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
          {/* USERNAME - EDITABLE */}
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={{
              color: "black",
              fontSize: 25,
              top: "5%",
              position: "relative",
              textAlign: "center",
            }}
          />

          {/* EMAIL - NOT EDITABLE */}
          <Text
            style={{
              color: "grey",
              fontSize: 18,
              marginTop: 10,
            }}
          >
            {user.email}
          </Text>

          {/* PHONE NUMBER - EDITABLE */}
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={{
              color: "grey",
              fontSize: 18,
              marginTop: 5,
              textAlign: "center",
            }}
          />
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          onPress={saveProfile}
          style={{
            backgroundColor: "black",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginVertical: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default IntroPanel;

const styles = StyleSheet.create({});
