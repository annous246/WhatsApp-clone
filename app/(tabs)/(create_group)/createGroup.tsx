import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { getUsers } from "@/app/services/user";
import { AuthContext } from "@/app/context/AuthProvider";
import { createGroup } from "@/app/services/group";
import { TextInput } from "react-native-gesture-handler";
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const CreateGroup = () => {
  const user = useContext(AuthContext).user ?? {};
  const [users, setUsers] = useState<any[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  async function fetchUsers() {
    const currentUsers = await getUsers(user.uid);
    setUsers(currentUsers ?? []);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const create = async () => {
    console.log("Creating group with:", selectedIds);
    const res = await createGroup([...selectedIds, user.uid], groupName);
    if (res) {
      setGroupName("");
      setSelectedIds([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.listContainer}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {users.map((userItem) => {
          const isSelected = selectedIds.includes(userItem.id);
          return (
            <TouchableOpacity
              key={userItem.id}
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => toggleSelect(userItem.id)}
            >
              <Text style={styles.username}>{userItem.username}</Text>
              <Text style={styles.email}>{userItem.email}</Text>
              <Text style={styles.phone}>{userItem.phoneNumber}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomButton}>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          value={groupName}
          onChangeText={setGroupName}
          placeholderTextColor="#999"
        />
        <Button
          title="Create Group"
          onPress={create}
          disabled={selectedIds.length <= 1 || groupName.length === 0}
          color={
            selectedIds.length > 1 && groupName.length > 0 ? "#28a745" : "#ccc"
          }
        />
      </View>
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContainer: {
    flex: 1,
    maxHeight: screenHeight - 270,
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
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: "#d4edda",
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
  bottomButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});
