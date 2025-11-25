import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function saveUsername(username: string, uid: string) {
  try {
    await updateDoc(doc(db, "users", uid), { username });
    return true;
  } catch (e: any) {
    console.log("error updating username " + e.message);
    return false;
  }
}

export async function savePhone(phoneNumber: string, uid: string) {
  try {
    await updateDoc(doc(db, "users", uid), { phoneNumber });
    return true;
  } catch (e: any) {
    console.log("error updating phone " + e.message);
    return false;
  }
}

export async function getUsers(uid: string) {
  try {
    const usersCol = collection(db, "users");
    const usersSnapshot = await getDocs(usersCol);
    // Map each document snapshot to include its ID
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id, // this is the document ID
      ...doc.data(), // all the document fields
    }));
    const filteredList = usersList.filter((user) => user.id != uid);
    console.log("filteredList");
    console.log(filteredList);
    return filteredList;
  } catch (e: any) {
    console.log("error pulling users " + e.message);
    return null;
  }
}
