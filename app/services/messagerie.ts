import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { messageType } from "../(tabs)/(contacts)/chat";

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
        currentMessages.push({ message: msgs.message, me: id1 == msgs.sender });
      });
      setMessages(currentMessages);
    });

    return unsubscribe;
  } catch (e: any) {
    console.log("error getting chat " + e.messsage);
    return null;
  }
}
export async function sendMessage(
  fromId: string,
  toId: string,
  message: string
) {
  try {
    await addDoc(collection(db, "messages"), {
      sender: fromId,
      receiver: toId,
      message: message,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (e: any) {
    console.log("error sending message " + e.message);
    return false;
  }
}
