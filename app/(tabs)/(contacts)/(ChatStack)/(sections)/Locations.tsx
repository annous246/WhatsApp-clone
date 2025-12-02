import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getLocations } from "@/app/services/messagerie";
import { useRoute } from "@react-navigation/native";
import { Unsubscribe } from "firebase/auth";
import { AuthContext } from "@/app/context/AuthProvider";

export interface messageType {
  id: string;
  message: string;
  me: boolean;
  username?: string;
  date?: string;
  type?: string;
}

const Locations = () => {
  const [locations, setLocations] = useState<messageType[]>([]);
  const unsubscribe = useRef<Unsubscribe | null>(null);
  const route = useRoute<any>();
  const { id } = route.params;
  const { user } = useContext(AuthContext);

  function fetchLocations() {
    return getLocations(user.uid, id, setLocations);
  }

  useEffect(() => {
    if (id) {
      unsubscribe.current = fetchLocations();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      unsubscribe.current?.();
    };
  }, []);

  const handlePress = (location: messageType) => {
    // message format: "lat,long"
    const [lat, lng] = location.message.split(",");

    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {locations.map((loc) => (
        <TouchableOpacity
          key={loc.id}
          style={styles.button}
          onPress={() => handlePress(loc)}
        >
          <Text style={styles.buttonText}>{loc.message}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Locations;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "bold",
  },
  button: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  buttonText: {
    fontSize: 16,
  },
});
