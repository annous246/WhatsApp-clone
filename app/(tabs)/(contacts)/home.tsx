import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { getUsers } from "@/app/services/user";
import { AuthContext } from "@/app/context/AuthProvider";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  home: undefined;
  chat: { id: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "home"
>;
const Home = () => {
  const user = useContext(AuthContext).user ?? {};
  const [users, setUsers] = useState<any[]>([]);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const openChat = (id: string) => {
    navigation.navigate("chat", { id });
  };
  async function fetchUsers() {
    const currentUsers = await getUsers(user.uid);
    setUsers(currentUsers ?? []);
  }
  useEffect(() => {
    console.log(users);
  }, [users]);
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users List</Text>
      {users.map((userItem) => (
        <TouchableOpacity
          key={userItem.id}
          style={styles.card}
          onPress={() => openChat(userItem.id)}
        >
          <Text style={styles.username}>{userItem.username}</Text>
          <Text style={styles.email}>{userItem.email}</Text>
          <Text style={styles.phone}>{userItem.phoneNumber}</Text>
        </TouchableOpacity>
      ))}
    </View>
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
