import { StyleSheet, Text, View } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { StepperContext } from "./StepperProvider";
import axios from "axios";
import { Post } from "../services/api";
import Constants from "expo-constants";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { updateUserStatus } from "../services/user";
const { API_URL } = Constants.expoConfig?.extra;

interface AuthContextSettingsInterface {
  user?: any;
  setUser: any;
  userToken: any;
  setUserToken: any;
  login?: any;
  logout?: any;
}
const AuthContext = createContext<AuthContextSettingsInterface>({
  user: null,
  setUser: null,
  userToken: null,
  setUserToken: null,
  login: null,
  logout: null,
});

// headers: { Authorization: userToken }
interface AuthContextInterface {
  children: any;
}

const AuthProvider = (props: AuthContextInterface) => {
  const [userToken, setUserToken] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const StepperSettings = useContext(StepperContext);
  async function testToken() {
    console.log("testing");
    const res = await Post(API_URL + "/auth/validate", {});
    console.log(res);
    return res.ok == 1;
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // user is valid, token is valid.
        console.log("here");
        console.log("firebaseUser");
        console.log(firebaseUser);

        async function check(firebaseUser: any) {
          try {
            console.log("*************************************");
            const token = await firebaseUser.getIdToken();
            let currentUser: any = {};
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            console.log(snap);
            console.log(snap.data());
            if (snap.exists()) currentUser = snap.data();

            console.log(currentUser);
            console.log("token");
            console.log(token);
            currentUser["uid"] = firebaseUser.uid;
            currentUser.status = true;
            console.log("user");
            console.log(currentUser);

            await updateUserStatus(currentUser.uid, true);

            setUser(currentUser);
            setUserToken(token);
          } catch (e: any) {
            console.log("error refreshing token : " + e.message);
          }
        }
        check(firebaseUser);
      } else {
        // no valid session
        if (user) {
          const invalidateStatus = async () => {
            await updateUserStatus(user.uid, false);
          };
          invalidateStatus;
        }
        setUserToken(null);
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log("user toekn changed");
    console.log(userToken);
  }, [userToken]);
  /*
  useEffect(() => {
    //45
    console.log("userToken");
    console.log(userToken);
    if (!userToken) {
      //logged out or expired

      //delete token and user
      console.log("signed nullified");
      saveToken(null, null);
      //clear the rest of attributes
      clearStorage();
      router.push("/");
    } else {
      //logged in
      console.log("signed************************************************");
      saveToken(userToken, user);
      if (user) StepperSettings.setStepper(user.stepper);
      router.push("/(tabs)/create");
    }
  }, [userToken]);
  useEffect(() => {
    if (user && userToken) {
      saveToken(userToken, user);
    }
  }, [user]);*/

  return (
    <AuthContext.Provider
      value={{
        user: user,
        setUser: setUser,
        userToken: userToken,
        setUserToken: setUserToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({});
export { AuthContext, AuthProvider };
