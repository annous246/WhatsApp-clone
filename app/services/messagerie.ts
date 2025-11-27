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
