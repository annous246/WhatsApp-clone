import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import ZoomableImage from "@/app/components/zoomableImage";
import { MaterialIcons } from "@expo/vector-icons";
import icons from "@/app/constants/icons";
import AudioMessage from "./AudioMessage";

type MessageProps = {
  message: string;
  me: boolean;
  username?: string;
  date?: string;
  type?: string;
  id?: string;
  deleteMessage: any;
  editMessage: any;
  imageLink: string | null;
};

const Message = ({
  message,
  me,
  username = "user",
  date = "date",
  type = "message",
  deleteMessage,
  editMessage,
  imageLink,
}: MessageProps) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>(message);
  const openLocation = async () => {
    const supported = await Linking.canOpenURL(message);
    if (supported) {
      await Linking.openURL(message);
    } else {
      alert("Cannot open link");
    }
  };

  function startEditing() {
    setEditing(true);
  }

  function handleMessage(msg: string) {
    console.log(msg);
    setCurrentMessage(msg);
  }
  function handleEditing() {
    if (!currentMessage || !currentMessage.length) return;
    editMessage(currentMessage);
    setEditing(false);
  }
  function renderImage() {
    return !imageLink ? (
      <Image
        source={icons.person}
        style={{
          width: 10,
          height: 10,
          padding: 10,
          marginRight: !me ? 20 : 0,
          borderRadius: 100,
        }}
      />
    ) : (
      <Image
        source={{ uri: imageLink }}
        style={{
          width: 10,
          height: 10,

          marginRight: !me ? 20 : 0,
          padding: 10,
          borderRadius: 100,
        }}
      />
    );
  }
  return (
    <View style={[styles.wrapper, me ? styles.wrapperMe : styles.wrapperOther]}>
      {/* only other user */}
      <View
        style={{
          flexDirection: "row",
          padding: 0,
          marginBottom: 5,
        }}
      >
        {renderImage()}
        {!me && <Text style={styles.username}>{username}</Text>}
      </View>
      {type == "message" ? (
        !editing ? (
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
        ) : (
          <View
            style={[
              styles.container,
              me ? styles.meContainer : styles.otherContainer,
              { backgroundColor: "#e5e5e5" }, // <-- gray bubble
            ]}
          >
            <TextInput
              value={currentMessage}
              onChangeText={handleMessage}
              multiline
              style={[
                styles.text,
                { color: "black" }, // text becomes dark since bg is gray
              ]}
            />

            <Text style={[styles.date, me ? styles.dateMe : styles.dateOther]}>
              {date}
            </Text>
          </View>
        )
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
      ) : type == "image" ? (
        <ZoomableImage uri={message} />
      ) : (
        <AudioMessage url={message} />
      )}

      <View style={{ flexDirection: "row" }}>
        {type == "message" &&
          me &&
          (!editing ? (
            <TouchableOpacity
              onPress={startEditing}
              style={{ marginRight: 25 }}
            >
              {/* <MaterialIcons name="delete" size={20} color="red" /> */}
              <Text>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEditing} style={{ marginLeft: 8 }}>
              {/* <MaterialIcons name="delete" size={20} color="red" /> */}
              <Text>Save</Text>
            </TouchableOpacity>
          ))}
        {me && (
          <TouchableOpacity onPress={deleteMessage} style={{ marginLeft: 8 }}>
            {/* <MaterialIcons name="delete" size={20} color="red" /> */}
            <Text>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
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
    textAlign: "center",
    verticalAlign: "middle",
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
