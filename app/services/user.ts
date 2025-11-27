import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import * as Location from "expo-location";
import { pickAndUploadImage } from "./image";

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
export async function addProfilePicture(userId: string) {
  try {
    const url = await pickAndUploadImage();
    if (url && url.length) {
      await updateDoc(doc(db, "users", userId), {
        image: url,
      });
      return url;
    } else {
      return null;
    }
  } catch (e: any) {
    console.log(e);
    return null;
  }
}
export function subscribeUsers(
  currentUserId: string,
  callback: (users: any[]) => void
) {
  const q = query(collection(db, "users"));

  const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
    const list = snap.docs
      .filter((d) => d.id !== currentUserId) //
      .map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });

  return unsubscribe;
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
export async function getCurrentLocationLink(): Promise<string | null> {
  try {
    // Get permission first
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      let req = await Location.requestForegroundPermissionsAsync();
      if (req.status !== "granted") return null;
    }

    // Get location
    const loc = await Location.getCurrentPositionAsync({});

    const lat = loc.coords.latitude;
    const lon = loc.coords.longitude;

    // Build Google Maps link
    const link = `https://www.google.com/maps?q=${lat},${lon}`;

    return link;
  } catch (err) {
    console.log("Location error:", err);
    return null;
  }
}
export async function updateUserStatus(userId: string, status: boolean) {
  try {
    await updateDoc(doc(db, "users", userId), {
      status: status,
    });
    return true;
  } catch (e: any) {
    console.log("Error updating status:", e.message);
    return false;
  }
}
export async function checkLocationPermission(): Promise<boolean> {
  try {
    // 1. Check existing permission
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status === "granted") {
      return true; // already ok
    }

    if (status === "denied") {
      return false; // user previously declined
    }

    // 2. Ask for permission (status === 'undetermined')
    let { status: askStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (askStatus === "granted") {
      return true; // user accepted now
    }

    return false; // user declined
  } catch (error) {
    console.log("Location permission error:", error);
    return false;
  }
}
