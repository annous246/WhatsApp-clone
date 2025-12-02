import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { getUsers, subscribeUsers } from "@/app/services/user";
import { AuthContext } from "@/app/context/AuthProvider";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import icons from "@/app/constants/icons";
import useAutoLogoutOnBackground from "@/app/hooks/useAutoLogoutOnBackground";
type RootStackParamList = {
  home: undefined;
  ChatLayout: { id: string; username: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "home"
>;
const Home = () => {
  useAutoLogoutOnBackground();
  const user = useContext(AuthContext).user ?? {};
  const [users, setUsers] = useState<any[]>([]);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const openChat = (id: string, username: string) => {
    navigation.navigate("ChatLayout", { id, username });
  };
  // async function fetchUsers() {
  //   const currentUsers = await getUsers(user.uid);
  //   setUsers(currentUsers ?? []);
  // }
  useEffect(() => {
    console.log(users);
  }, [users]);
  useEffect(() => {
    /*real time user getting */
    const unsub = subscribeUsers(user.uid, (liveUsers) => {
      setUsers(liveUsers);
    });

    // //******** */

    // const peerInstance = initPeer(user.uid, async (incomingCall) => {
    //   console.log("Incoming call from:", incomingCall.peer);

    //   // Conditional answer
    //   if (incomingCall.peer === user.uid) {
    //     try {
    //       const stream = await mediaDevices.getUserMedia({ audio: true });
    //       answerCall(incomingCall, stream);

    //       incomingCall.on("stream", (remoteStream: MediaProvider | null) => {
    //         // play remote audio
    //         const audio = new Audio();
    //         audio.srcObject = remoteStream;
    //         audio.play();
    //       });
    //     } catch (err) {
    //       console.log("Microphone access error:", err);
    //     }
    //   } else {
    //     console.log("Ignoring call from:", incomingCall.peer);
    //   }
    // });

    // return () => {
    //   // cleanup
    //   peerInstance.destroy();
    // };

    return () => unsub(); // cleanup
  }, []);
  const StatusDot = ({ status }: { status: boolean }) => (
    <View
      style={{
        margin: "auto",
        marginLeft: 10,
        marginTop: 11,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: status ? "green" : "red",
      }}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Users List</Text>
      {users.map((userItem) => (
        <TouchableOpacity
          key={userItem.id}
          style={styles.card}
          onPress={() => openChat(userItem.id, userItem.username)}
        >
          <View
            style={{
              borderRadius: 100,
              overflow: "hidden",
            }}
          >
            {userItem.image?.length == 0 ? (
              <Image
                source={icons.person}
                style={{
                  width: 30,
                  height: 30,
                  margin: 20,
                  padding: 30,
                  borderRadius: 100,
                }}
              />
            ) : (
              <Image
                source={{ uri: userItem.image }}
                style={{
                  width: 30,
                  height: 30,
                  margin: 20,
                  padding: 30,
                  borderRadius: 100,
                }}
              />
            )}
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.username}>{userItem.username}</Text>
              {<StatusDot status={userItem.status} />}
            </View>
            <Text style={styles.email}>{userItem.email}</Text>
            <Text style={styles.phone}>{userItem.phoneNumber}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ marginBottom: 25 }}></View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 3,
  },
  phone: {
    fontSize: 16,
    color: "#555",
  },
});
