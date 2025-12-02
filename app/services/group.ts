import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  where,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  runTransaction,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

import uuid from "react-native-uuid";
export async function getGroups(userId: string) {
  try {
    if (!userId) return [];

    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("groupUsers", "array-contains", userId));

    const snapshot = await getDocs(q);

    const groups: any[] = snapshot.docs.map((doc) => ({
      groupId: doc.id,
      ...doc.data(),
    }));

    return groups;
  } catch (e: any) {
    console.log("Error fetching groups: " + e.message);
    return [];
  }
}
export async function createGroup(ids: string[], groupName: string) {
  try {
    if (!ids || ids.length < 2) return false;

    const groupId = uuid.v4().toString();

    const groupRef = doc(collection(db, "groups"), groupId);
    await setDoc(groupRef, {
      groupId,
      groupName,
      groupUsers: ids,
      createdAt: new Date(),
    });

    for (const userId of ids) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        groups: arrayUnion(groupId),
      });
    }

    console.log(
      `Group "${groupName}" created successfully with ID: ${groupId}`
    );
    return true;
  } catch (e: any) {
    console.log("Error creating group: " + e.message);
    return false;
  }
}
import { messageType } from "../(tabs)/(groups)/groupChat";
import { Unsubscribe } from "firebase/auth";

export async function getchat(
  userId: string,
  groupId: string,
  setMessages: any
): Promise<Unsubscribe | null> {
  try {
    const q = query(
      collection(db, "groupMessages"),
      orderBy("createdAt", "asc"),
      where("groupId", "==", groupId)
    );
    const unsubscribe = onSnapshot(q, async (snap) => {
      let msgs = [];
      snap.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
      const currentMessages: messageType[] = [];

      //image getting part
      const senderSet = new Set<string>();
      msgs.forEach((m: any) => senderSet.add(m.senderId));

      const imageMap: any = {};
      for (const uid of senderSet) {
        const userDoc = await getDoc(doc(db, "users", uid));
        imageMap[uid] = userDoc.exists() ? userDoc.data().image : null;
      }

      //****************** */

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
          message: message.message,
          id: message.id,
          me: userId == message.senderId,
          username: message.senderUsername,
          type: message.type,
          date: currentDate.toDateString(),
          image: imageMap[message.senderId],
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
  userId: string,
  groupId: string,
  message: string,
  senderUsername: string,
  type: string
) {
  try {
    const res = await addDoc(collection(db, "groupMessages"), {
      senderId: userId,
      groupId: groupId,
      message: message,
      createdAt: serverTimestamp(),
      senderUsername,
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
    await deleteDoc(doc(db, "groupMessages", messageId));
    return true;
  } catch (e: any) {
    console.log("error deleting message " + e.message);
    return false;
  }
}

export async function editMessage(
  messageId: string,
  newMessage: string
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "groupMessages", messageId), {
      message: newMessage,
    });
    return true;
  } catch (e: any) {
    console.log("error " + e);
    return false;
  }
}

export async function leaveGroup(userId: string, groupId: string) {
  const groupRef = doc(db, "groups", groupId);
  const userRef = doc(db, "users", userId);

  try {
    await runTransaction(db, async (transaction) => {
      // Read current docs
      const groupSnap = await transaction.get(groupRef);
      const userSnap = await transaction.get(userRef);

      if (!groupSnap.exists()) throw new Error("Group not found");
      if (!userSnap.exists()) throw new Error("User not found");

      // Remove user from group
      transaction.update(groupRef, {
        groupUsers: arrayRemove(userId),
      });

      // Remove group from user
      transaction.update(userRef, {
        groups: arrayRemove(groupId),
      });
    });

    return true;
  } catch (e: any) {
    console.log("Transaction failed:", e.message);
    return false;
  }
}
