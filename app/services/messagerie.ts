import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import RNFetchBlob from "rn-fetch-blob"; // Import RNFetchBlob

import RNFS from "react-native-fs";
import { db } from "./firebase";
import { messageType } from "../(tabs)/(contacts)/(ChatStack)/chat";
import { Unsubscribe } from "firebase/auth";
import { supabase } from "./supabase";
export async function editMessage(
  messageId: string,
  newMessage: string
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "messages", messageId), { message: newMessage });
    return true;
  } catch (e: any) {
    console.log("error " + e);
    return false;
  }
}

export function getLocations(
  id1: string,
  id2: string,
  setLocations: any
): Unsubscribe | null {
  try {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc"),
      where("sender", "in", [id1, id2]),
      where("receiver", "in", [id1, id2])
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      let msgs = [];
      snap.forEach((doc) => {
        if (doc.data().type == "location")
          msgs.push({ id: doc.id, ...doc.data() });
      });
      const currentMessages: messageType[] = [];
      msgs.forEach((message: any) => {
        console.log("message");
        console.log(message);
        const currentDate = message.createdAt
          ? new Date(
              message.createdAt.seconds * 1000 +
                message.createdAt.nanoseconds / 1_000_000
            )
          : new Date();
        currentMessages.push({
          id: message.id,
          message: message.message,
          me: id1 == message.sender,
          username: message.receiverUsername,
          date: currentDate.toDateString(),
          type: message.type,
        });
      });
      console.log(currentMessages);
      setLocations(currentMessages);
    });

    return unsubscribe;
  } catch (e: any) {
    console.log("error getting chat " + e);
    return null;
  }
}
export async function uploadAudioSupabase(
  fileUri: string,
  uid: string
): Promise<string> {
  const fileName = `${Date.now()}.mp3`;

  try {
    // Read the file as base64
    const base64Data = await RNFS.readFile(fileUri, "base64");

    // Convert base64 to ArrayBuffer
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log("File to upload:", fileName);
    console.log("File size:", bytes.length);

    // Upload the ArrayBuffer to Supabase
    const { data, error } = await supabase.storage
      .from("whatsapp")
      .upload(`${uid}/${fileName}`, bytes.buffer, {
        contentType: "audio/mpeg", // Use 'audio/mpeg' for MP3 files
        upsert: false,
      });

    if (error) {
      console.log("Error uploading audio:", error.message);
      throw error;
    }

    // Get the public URL
    const { data: UrlData } = supabase.storage
      .from("whatsapp")
      .getPublicUrl(`${uid}/${fileName}`);

    return UrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
}
export function getImages(
  id1: string,
  id2: string,
  setLocations: any
): Unsubscribe | null {
  try {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc"),
      where("sender", "in", [id1, id2]),
      where("receiver", "in", [id1, id2])
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      let msgs = [];
      snap.forEach((doc) => {
        if (doc.data().type == "image")
          msgs.push({ id: doc.id, ...doc.data() });
      });
      const currentMessages: messageType[] = [];
      msgs.forEach((message: any) => {
        console.log("message");
        console.log(message);
        const currentDate = message.createdAt
          ? new Date(
              message.createdAt.seconds * 1000 +
                message.createdAt.nanoseconds / 1_000_000
            )
          : new Date();
        currentMessages.push({
          id: message.id,
          message: message.message,
          me: id1 == message.sender,
          username: message.receiverUsername,
          date: currentDate.toDateString(),
          type: message.type,
        });
      });
      console.log(currentMessages);
      setLocations(currentMessages);
    });

    return unsubscribe;
  } catch (e: any) {
    console.log("error getting chat " + e);
    return null;
  }
}
export function getchat(id1: string, id2: string, setMessages: any): any {
  try {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc"),
      where("sender", "in", [id1, id2]),
      where("receiver", "in", [id1, id2])
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      let msgs = [];
      snap.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
      const currentMessages: messageType[] = [];
      msgs.forEach((message: any) => {
        console.log("message");
        console.log(message);
        const currentDate = message.createdAt
          ? new Date(
              message.createdAt.seconds * 1000 +
                message.createdAt.nanoseconds / 1_000_000
            )
          : new Date();
        currentMessages.push({
          id: message.id,
          message: message.message,
          me: id1 == message.sender,
          username: message.receiverUsername,
          date: currentDate.toDateString(),
          type: message.type,
        });
      });
      console.log(currentMessages);
      setMessages(currentMessages);
    });

    return unsubscribe;
  } catch (e: any) {
    console.log("error getting chat " + e);
    return null;
  }
}
export async function sendMessage(
  fromId: string,
  toId: string,
  message: string,
  receiverUsername: string,
  type: string
) {
  try {
    const res = await addDoc(collection(db, "messages"), {
      sender: fromId,
      receiver: toId,
      message: message,
      createdAt: serverTimestamp(),
      receiverUsername: receiverUsername,
      type,
    });

    return true;
  } catch (e: any) {
    console.log("error sending message " + e.message);
    return false;
  }
}

export async function deleteMessage(messageId: string) {
  try {
    console.log(messageId);
    await deleteDoc(doc(db, "messages", messageId));
    return true;
  } catch (e: any) {
    console.log("error deleting message " + e.message);
    return false;
  }
}
