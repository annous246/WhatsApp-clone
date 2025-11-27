import Peer from "peerjs";
//import { MediaStream } from "react-native-webrtc";

let peer: Peer | null = null;
let currentCall: any = null;

export function initPeer(userId: string, onIncomingCall: (call: any) => void) {
  if (peer) return peer; // already initialized

  peer = new Peer(userId, {
    host: "your-peer-server.com", // optional if you have your own
    port: 443,
    path: "/",
    secure: true,
  });

  peer.on("open", (id) => {
    console.log("PeerJS connected with ID:", id);
  });

  peer.on("call", (call) => {
    currentCall = call;
    onIncomingCall(call);
  });

  peer.on("error", (err) => {
    console.log("PeerJS error:", err);
  });

  return peer;
}

export function callUser(remotePeerId: string, stream: MediaStream) {
  if (!peer) throw new Error("Peer not initialized");
  currentCall = peer.call(remotePeerId, stream);
  return currentCall;
}

export function answerCall(call: any, stream: MediaStream) {
  call.answer(stream);
  return call;
}

export function endCall() {
  if (currentCall) currentCall.close();
  currentCall = null;
}

export function getPeer() {
  return peer;
}
