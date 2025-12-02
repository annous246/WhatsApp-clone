// useAutoLogout.tsx
import { useContext, useEffect, useRef } from "react";
import { AppRegistry, AppState, AppStateStatus } from "react-native";
import { signOut } from "firebase/auth";
import { authLogout } from "../services/auth";
import { AuthContext } from "../context/AuthProvider";
import { functest, updateUserStatus } from "../services/user";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

//import BackgroundFetch from "react-native-background-fetch";

export default function useAutoLogoutOnBackground() {
  const current = useRef<AppStateStatus>(AppState.currentState);
  const user = useContext(AuthContext)?.user;
  const myBackgroundTask = async () => {
    console.log("Running background task...");
    // Firestore write or other async work
    await updateUserStatus(user.uid, false);
  };
  useEffect(() => {
    //initial status reactivation

    console.log("here *********** init");
    const sub = AppState.addEventListener("change", async (nextState) => {
      // when going from active -> background/inactive, do logout flow
      if (nextState === "background") {
        console.log("here *********** logging out");
        console.log(user.uid);
        try {
          //if (user.uid) updateUserStatus(user.uid, false);
          await updateUserStatus(user.uid, false);
        } catch (err) {
          console.warn("auto logout failed", err);
        }
      } else if (
        nextState === "active" &&
        (current.current === "background" || current.current === "inactive")
      ) {
        console.log("here *********** relog");
        console.log(user.uid);
        let res = false;
        try {
          if (user.uid) updateUserStatus(user.uid, true);
        } catch (err) {
          console.warn("auto logout failed", err);
        }
      }

      current.current = nextState;
    });

    return () => {
      sub.remove();
    };
  }, []);
}
