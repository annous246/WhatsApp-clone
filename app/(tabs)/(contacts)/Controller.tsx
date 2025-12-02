import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Button,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/app/context/AuthProvider";
import { sendMessage, uploadAudioSupabase } from "@/app/services/messagerie";
import {
  checkLocationPermission,
  getCurrentLocationLink,
  setIsTyping,
} from "@/app/services/user";
import { pickAndUploadImage } from "@/app/services/image";
import { messageType } from "./(ChatStack)/chat";
import { db, firestore } from "@/app/services/firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
import {
  RTCPeerConnection,
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import {
  startRecording,
  stopRecording,
} from "@/app/services/VoiceRecorderService";

type ControllerProps = {
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  receiverId: string;
  receiverUsername: string;
  setOtherIsTyping: any;
};

const Controller = ({
  setMessages,
  receiverId,
  receiverUsername,
  setOtherIsTyping,
}: ControllerProps) => {
  const { user } = useContext(AuthContext);

  const [currentMessage, setCurrentMessage] = useState("");
  const [callVisible, setCallVisible] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [recording, setRecording] = useState(false);
  const [callerId, setCallerId] = useState<string | null>(null);

  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const callDocUnsubscribe = useRef<(() => void) | null>(null);

  const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  // Listen for incoming calls on MY document
  useEffect(() => {
    const myCallDocRef = doc(firestore, "calls", user.uid);
    const unsubscribe = onSnapshot(myCallDocRef, async (docSnap) => {
      const data = docSnap.data();
      if (!data) return;

      // Someone is calling ME
      if (data.offer && !data.answer && data.from && data.from !== user.uid) {
        setCallerId(data.from);
        setIsCaller(false);
        setCallVisible(true);
        await answerCall(data.from, data.offer);
      }

      // Call ended by other person
      if (data.status === "ended") {
        endCall();
      }
    });
    const unsub = onSnapshot(doc(db, "users", receiverId), (snap) => {
      if (snap.exists()) {
        setOtherIsTyping(snap.data().isTyping);
      }
    });

    return () => {
      unsubscribe();
      unsub();
    };
  }, []);

  const setupPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(servers);
    pc.current = peerConnection;

    // Handle remote stream
    peerConnection.addEventListener("track", (event: any) => {
      if (event.streams && event.streams[0]) {
        remoteStream.current = event.streams[0];
        console.log("Received remote stream");
      }
    });

    // Handle ICE candidates
    peerConnection.addEventListener("icecandidate", async (event: any) => {
      if (event.candidate) {
        const targetDoc = isCaller ? receiverId : callerId;
        if (targetDoc) {
          await updateDoc(doc(firestore, "calls", targetDoc), {
            [`candidates.${user.uid}`]: JSON.stringify(event.candidate),
          });
        }
      }
    });

    return peerConnection;
  };

  const startCall = async () => {
    try {
      setIsCaller(true);
      setCallerId(receiverId);
      setCallVisible(true);

      const peerConnection = setupPeerConnection();

      // Get local audio stream
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      localStream.current = stream;

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Write offer to receiver's document
      await setDoc(doc(firestore, "calls", receiverId), {
        from: user.uid,
        offer: JSON.stringify(offer),
        status: "calling",
        candidates: {},
      });

      // Listen for answer on receiver's document
      listenForAnswer();
      setJoined(true);
    } catch (error) {
      console.error("Error starting call:", error);
      endCall();
    }
  };

  const listenForAnswer = () => {
    const receiverCallDocRef = doc(firestore, "calls", receiverId);
    callDocUnsubscribe.current = onSnapshot(
      receiverCallDocRef,
      async (docSnap) => {
        const data = docSnap.data();
        if (!data) return;

        // Apply answer
        if (data.answer && pc.current && !pc.current.remoteDescription) {
          const answer = new RTCSessionDescription(JSON.parse(data.answer));
          await pc.current.setRemoteDescription(answer);
          console.log("Answer applied");
        }

        // Apply ICE candidates from receiver
        if (data.candidates && data.candidates[receiverId]) {
          const candidate = new RTCIceCandidate(
            JSON.parse(data.candidates[receiverId])
          );
          await pc.current?.addIceCandidate(candidate);
        }
      }
    );
  };

  const answerCall = async (fromUserId: string, offerStr: string) => {
    try {
      const peerConnection = setupPeerConnection();

      // Get local audio stream
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      localStream.current = stream;

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Set remote description (offer)
      const offer = new RTCSessionDescription(JSON.parse(offerStr));
      await peerConnection.setRemoteDescription(offer);

      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Write answer to my own document
      await updateDoc(doc(firestore, "calls", user.uid), {
        answer: JSON.stringify(answer),
        status: "accepted",
      });

      // Listen for ICE candidates from caller
      listenForCallerCandidates(fromUserId);
      setJoined(true);
    } catch (error) {
      console.error("Error answering call:", error);
      endCall();
    }
  };

  const listenForCallerCandidates = (fromUserId: string) => {
    const myCallDocRef = doc(firestore, "calls", user.uid);
    callDocUnsubscribe.current = onSnapshot(myCallDocRef, async (docSnap) => {
      const data = docSnap.data();
      if (!data || !data.candidates) return;

      // Apply ICE candidates from caller
      if (data.candidates[fromUserId]) {
        const candidate = new RTCIceCandidate(
          JSON.parse(data.candidates[fromUserId])
        );
        await pc.current?.addIceCandidate(candidate);
      }
    });
  };

  const endCall = async () => {
    // Stop all tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }

    // Close peer connection
    if (pc.current) {
      pc.current.close();
    }

    // Unsubscribe from Firestore listener
    if (callDocUnsubscribe.current) {
      callDocUnsubscribe.current();
      callDocUnsubscribe.current = null;
    }

    // Clear Firestore documents
    const targetUserId = isCaller ? receiverId : callerId;
    if (targetUserId) {
      await updateDoc(doc(firestore, "calls", targetUserId), {
        status: "ended",
      });
    }

    // Reset state
    pc.current = null;
    localStream.current = null;
    remoteStream.current = null;
    setCallVisible(false);
    setJoined(false);
    setIsCaller(false);
    setCallerId(null);
  };

  // Messaging
  const send = async () => {
    if (!currentMessage.trim()) return;
    await sendMessage(
      user.uid,
      receiverId,
      currentMessage.trim(),
      receiverUsername,
      "message"
    );
    setCurrentMessage("");
  };
  async function handleTyping(status: boolean) {
    await setIsTyping(user.uid, status);
  }
  const sendLocation = async () => {
    try {
      const res = await checkLocationPermission();
      if (!res) return;
      const location = await getCurrentLocationLink();
      if (!location) throw new Error("Cannot get location");
      await sendMessage(
        user.uid,
        receiverId,
        location,
        receiverUsername,
        "location"
      );
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const sendPicture = async () => {
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) return;
    await sendMessage(
      user.uid,
      receiverId,
      imageUrl,
      receiverUsername,
      "image"
    );
  };

  const handleRecord = async () => {
    console.log("here");
    console.log(recording);

    let result = null;

    if (!recording) {
      try {
        await startRecording(user.uid); // Assuming `user.uid` is correct
        setRecording(true);
      } catch (error) {
        console.error("Error starting recording: ", error);
      }
    } else {
      try {
        result = await stopRecording();
        setRecording(false);
        //DONE RECORDING SAVE RECORDING SUPABASE AND SAVE MESSAGE
        const supaUrl = await uploadAudioSupabase(result, user.uid);
        if (supaUrl) {
          //save it in messages
          await sendMessage(
            user.uid,
            receiverId,
            supaUrl,
            receiverUsername,
            "audio"
          );
        }
      } catch (error) {
        console.error("Error stopping recording: ", error);
      }
    }

    console.log("Recording Result:", result); // Log result after state change
    // Optionally store the result in the state
    // Optionally, you can show a toast on Android to confirm the action
    if (Platform.OS === "android") {
      ToastAndroid.show(`Recording saved at: ${result}`, ToastAndroid.SHORT);
    }
  };
  return (
    <View style={styles.container}>
      {/* //   <Modal visible={callVisible} animationType="slide" transparent={false}>
    //     <View
    //       style={{
    //         flex: 1,
    //         justifyContent: "center",
    //         alignItems: "center",
    //         backgroundColor: "#000",
    //       }}
    //     >
    //       <Text style={{ fontSize: 24, marginBottom: 10, color: "#fff" }}>
    //         {joined ? "🔊 In Call" : "📞 Connecting..."}
    //       </Text>
    //       <Text style={{ fontSize: 16, marginBottom: 30, color: "#aaa" }}>
    //         {isCaller
    //           ? `Connected with ${receiverUsername}`
    //           : `Connected with ${receiverUsername}`}
    //       </Text>
    //       <Button title="End Call" color="red" onPress={endCall} />
    //     </View>
    //   </Modal>

    //   <TouchableOpacity style={styles.iconButton} onPress={startCall}>
    //     <Ionicons name="call" size={28} color={joined ? "red" : "#1e90ff"} />
    //   </TouchableOpacity> */}

      <TouchableOpacity style={styles.iconButton} onPress={sendLocation}>
        <Text style={styles.iconText}>📍</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={handleRecord}>
        <Text style={styles.iconText}>Voice</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={currentMessage}
        onChangeText={setCurrentMessage}
        placeholder="Type a message..."
        onFocus={() => {
          handleTyping(true);
        }}
        onBlur={() => {
          handleTyping(false);
        }}
      />

      <TouchableOpacity style={styles.iconButton} onPress={sendPicture}>
        <Text style={styles.iconText}>📷</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sendButton} onPress={send}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Controller;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendText: { color: "white", fontWeight: "600" },
  iconButton: { paddingHorizontal: 10, paddingVertical: 5 },
  iconText: { fontSize: 20 },
});
