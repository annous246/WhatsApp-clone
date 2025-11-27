import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import React, { useEffect } from "react";
import ZoomableImage from "@/app/components/zoomableImage";
import { MaterialIcons } from "@expo/vector-icons";

type MessageProps = {
  message: string;
  me: boolean;
  username?: string;
  date?: string;
  type?: string;
  id?: string;
  deleteMessage: any;
};

const Message = ({
  message,
  me,
  username = "user",
  date = "date",
  type = "message",
  deleteMessage,
}: MessageProps) => {
  const openLocation = async () => {
    const supported = await Linking.canOpenURL(message);
    if (supported) {
      await Linking.openURL(message);
    } else {
      alert("Cannot open link");
    }
  };

  return (
    <View style={[styles.wrapper, me ? styles.wrapperMe : styles.wrapperOther]}>
      {/* Show username ONLY for other users */}
      {!me && <Text style={styles.username}>{username}</Text>}
      {type == "message" ? (
        <View
          style={[
            styles.container,
            me ? styles.meContainer : styles.otherContainer,
          ]}
        >
          <Text style={[styles.text, me ? styles.meText : styles.otherText]}>
            {message}
          </Text>

          <Text style={[styles.date, me ? styles.dateMe : styles.dateOther]}>
            {date}
          </Text>
        </View>
      ) : type == "location" ? (
        <TouchableOpacity
          onPress={openLocation}
          style={[
            styles.container,
            me ? styles.meContainer : styles.otherContainer,
          ]}
        >
          <Text style={[styles.text, me ? styles.meText : styles.otherText]}>
            {message}
          </Text>

          <Text style={[styles.date, me ? styles.dateMe : styles.dateOther]}>
            {date}
          </Text>
        </TouchableOpacity>
      ) : (
        <ZoomableImage uri={message} />
      )}
      {me && (
        <TouchableOpacity onPress={deleteMessage} style={{ marginLeft: 8 }}>
          <MaterialIcons name="delete" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    maxWidth: "75%",
    marginBottom: 25,
  },
  wrapperMe: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  wrapperOther: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },

  username: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3b5998",
    marginBottom: 2,
  },

  container: {
    padding: 10,
    borderRadius: 15,
  },
  meContainer: {
    backgroundColor: "#007AFF",
    borderTopRightRadius: 0,
  },
  otherContainer: {
    backgroundColor: "#E5E5EA",
    borderTopLeftRadius: 0,
  },

  text: {
    fontSize: 16,
  },
  meText: {
    color: "white",
  },
  otherText: {
    color: "black",
  },

  date: {
    fontSize: 10,
    marginTop: 5,
    opacity: 0.7,
  },
  dateMe: {
    color: "#dfe9ff",
    alignSelf: "flex-end",
  },
  dateOther: {
    color: "#555",
    alignSelf: "flex-start",
  },
});
