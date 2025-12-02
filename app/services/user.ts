import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { pickAndUploadImage } from "./image";

import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import type { GeolocationResponse } from "@react-native-community/geolocation";

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
      .filter((d) => d.id !== currentUserId)
      .map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });

  return unsubscribe;
}
export async function getUser(uid: string) {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return false;

    return {
      uid: uid, // doc id
      ...snap.data(), // user fields
    };
  } catch (e: any) {
    console.log("error " + e);
    return null;
  }
}
export async function getUsers(uid: string) {
  try {
    const usersCol = collection(db, "users");
    const usersSnapshot = await getDocs(usersCol);
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const filteredList = usersList.filter((user) => user.id !== uid);
    console.log("filteredList");
    console.log(filteredList);
    return filteredList;
  } catch (e: any) {
    console.log("error pulling users " + e.message);
    return null;
  }
}

// ---- Location helpers using React Native modules ---- //

async function ensureLocationPermission(): Promise<boolean> {
  // iOS: permissions are requested automatically when calling Geolocation.getCurrentPosition,
  // as long as you have the correct Info.plist keys. We just return true here.
  if (Platform.OS === "ios") {
    return true;
  }

  if (Platform.OS === "android") {
    const fine = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
    const coarse = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

    // Check if already granted
    const hasFine = await PermissionsAndroid.check(fine);
    const hasCoarse = await PermissionsAndroid.check(coarse);

    if (hasFine || hasCoarse) {
      return true;
    }

    // Request permission
    const status = await PermissionsAndroid.request(fine);

    return status === PermissionsAndroid.RESULTS.GRANTED;
  }

  return false;
}

function getCurrentPosition(): Promise<GeolocationResponse> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
}

export async function getCurrentLocationLink(): Promise<string | null> {
  try {
    const hasPermission = await ensureLocationPermission();
    if (!hasPermission) {
      return null;
    }

    const loc = await getCurrentPosition();

    const lat = loc.coords.latitude;
    const lon = loc.coords.longitude;

    const link = `https://www.google.com/maps?q=${lat},${lon}`;

    return link;
  } catch (err) {
    console.log("Location error:", err);
    return null;
  }
}
export function functest() {
  console.log("fuuuuuuuuuuuuun");
  return 0;
}
export async function updateUserStatus(userId: string, currentStatus: boolean) {
  try {
    console.log(userId);
    console.log(currentStatus);
    const result = await updateDoc(doc(db, "users", userId), {
      status: currentStatus,
    });
    console.log("result");
    console.log(result);
    return true;
  } catch (e: any) {
    console.log("Error updating currentStatus:", e.message);
    return false;
  }
}

export async function checkLocationPermission(): Promise<boolean> {
  try {
    // Reuse the same helper – it checks and, if needed, requests permission
    const granted = await ensureLocationPermission();
    return granted;
  } catch (error) {
    console.log("Location permission error:", error);
    return false;
  }
}

export const setIsTyping = async (userId: string, typing: boolean) => {
  if (!userId) return;
  try {
    await updateDoc(doc(db, "users", userId), { isTyping: typing });
  } catch (e) {
    console.error("setIsTyping error:", e);
  }
};
