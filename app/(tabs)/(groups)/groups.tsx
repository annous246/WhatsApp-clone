import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { getGroups } from "@/app/services/group";
import { AuthContext } from "@/app/context/AuthProvider";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
type RootStackParamList = {
  groups: undefined;
  group_chat: { groupId: string; groupName: string };
};

type NavProp = NativeStackNavigationProp<RootStackParamList, "groups">;

const GroupsList = () => {
  const navigation = useNavigation<NavProp>();

  const user = useContext(AuthContext).user ?? {};
  const [groups, setGroups] = useState<any[]>([]);

  async function fetchGroups() {
    const existingGroups = await getGroups(user.uid);
    setGroups(existingGroups ?? []);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  function reload() {
    fetchGroups();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Groups List</Text>

      {groups.map((group) => (
        <TouchableOpacity
          key={group.groupId}
          style={styles.card}
          onPress={() =>
            navigation.navigate("group_chat", {
              groupId: group.groupId,
              groupName: group.groupName,
            })
          }
        >
          <Text style={styles.groupName}>{group.groupName}</Text>
          <Text style={styles.groupUsers}>
            Members: {group.groupUsers?.length ?? 0}
          </Text>
        </TouchableOpacity>
      ))}

      <Button title="Reload" onPress={reload} />
      <View style={{ marginBottom: 25 }}></View>
    </ScrollView>
  );
};

export default GroupsList;

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
    elevation: 3,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  groupUsers: {
    fontSize: 16,
    color: "#555",
  },
});
