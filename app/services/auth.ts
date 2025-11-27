import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "./firebase";
import { updateUserStatus } from "./user";
export async function authSingIn(
  password: string,
  email: string
): Promise<boolean> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await result.user.reload();
    return true;
  } catch (e: any) {
    console.log("error singing up " + e.message);
    return false;
  }
}

export async function authLogout(userId): Promise<boolean> {
  try {
    await updateUserStatus(userId, false);

    const result = await signOut(auth);
    return true;
  } catch (e: any) {
    return false;
    console.log("logout error " + e.message);
  }
}
export const authSignUp = async (
  username: string,
  email: string,
  password: string,
  phoneNumber: string
): Promise<boolean> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Create Firestore profile
    console.log("creating ...");
    console.log(user);
    console.log(user.uid);
    const docresult = await setDoc(doc(db, "users", user.uid), {
      username,
      email: user.email,
      createdAt: Date.now(),
      phoneNumber,
    });
    // Force Firebase to refresh the user data
    console.log("user created");
    console.log(docresult);

    await result.user.reload();
    //await authLogout();

    // Return the updated user, not the old one
    return true;
  } catch (e: any) {
    console.log("logout error : " + e.message);
    return false;
  }
};
