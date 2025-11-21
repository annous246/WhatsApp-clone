import { Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Post } from "../services/api";
import Constants from "expo-constants";
import { timeDiff } from "../utils/utils";

const { API_URL } = Constants.expoConfig?.extra;
const useAutoTimer = (realReset: () => void) => {
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function checkDate() {
    try {
      const currentDate = await AsyncStorage.getItem("currentDate");
      console.log("here");
      console.log(currentDate);
      console.log(typeof currentDate);
      if (!currentDate) return false;
      let p = JSON.parse(currentDate);
      console.log(p);
      const activeLastDate = new Date(JSON.parse(currentDate));
      const nextDate = new Date(activeLastDate);
      console.log("hre");
      nextDate.setDate(activeLastDate.getDate() + 1);
      console.log(" ");
      nextDate.setHours(0, 0, 0, 0);
      const now = new Date();
      console.log("he");

      return now.getTime() >= nextDate.getTime();
    } catch (e) {
      console.log(e.message + " " + e.stack);
      return false;
    }
  }

  async function reset() {
    //emit event resetter
    //add security
    const securelychange = await checkDate();
    if (securelychange) {
      //securely reset

      realReset();
      console.log("reset done");
    }

    console.log("reset ");
  }
  async function dynamicChange() {
    const currentDate = await AsyncStorage.getItem("currentDate");
    console.log("currentDate*******************");
    console.log(typeof currentDate);
    if (!currentDate) return;
    console.log("dateChanged");
    const dateChanged = await checkDate();
    console.log(dateChanged);
    if (dateChanged) {
      //updateto new time and reset
      reset();
    } else {
      //timeout remaining time

      const activeLastDate = new Date(JSON.parse(currentDate));
      const nextDate = new Date(activeLastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);

      const tillReset = timeDiff(new Date(), nextDate);
      console.log("remaining time");
      console.log(tillReset);
      timeoutRef.current = setTimeout(() => {
        reset();
      }, tillReset * 1000);
    }
  }
  async function handleAppState(nextState: AppStateStatus) {
    /*
    console.log("prev change");
    console.log(AppState.currentState);
    console.log("app change");
    console.log(nextState);*/
    const currentState = appState.current;
    if (nextState === "active") {
      /// app state change to active app
      await dynamicChange();
    }
  }

  useEffect(() => {
    console.log("timerrrr rrrrr");
    dynamicChange();
    const appEL = AppState.addEventListener("change", handleAppState);
    return () => {
      appEL.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};

export default useAutoTimer;
