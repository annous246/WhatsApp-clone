import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Modal,
  Pressable,
  Dimensions,
  Animated,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Unsubscribe } from "firebase/auth";
import { AuthContext } from "@/app/context/AuthProvider";
import { getImages } from "@/app/services/messagerie";

const { width, height } = Dimensions.get("window");

export interface messageType {
  id: string;
  message: string; // URL
  me: boolean;
  username?: string;
  date?: string;
  type?: string;
}

const Media = () => {
  const [mediaList, setMediaList] = useState<messageType[]>([]);
  const unsubscribe = useRef<Unsubscribe | null>(null);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const scale = useRef(new Animated.Value(1)).current;

  const route = useRoute<any>();
  const { id } = route.params;
  const { user } = useContext(AuthContext);

  function fetchMedia() {
    return getImages(user.uid, id, setMediaList);
  }

  useEffect(() => {
    if (id) unsubscribe.current = fetchMedia();
  }, [id]);

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const handlePress = (media: messageType) => {
    setCurrentImage(media.message);
    setViewerVisible(true);
  };

  const handleClose = () => {
    setViewerVisible(false);
    scale.setValue(1); // reset zoom
  };

  const handleZoom = (e: any) => {
    const zoom = e.nativeEvent.scale;
    scale.setValue(zoom);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.gallery}>
        {mediaList.map((file) => (
          <TouchableOpacity
            key={file.id}
            style={styles.imageContainer}
            onPress={() => handlePress(file)}
          >
            <Image
              source={{ uri: file.message }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Fullscreen Zoom Viewer */}
      <Modal visible={viewerVisible} transparent={true}>
        <Pressable style={styles.viewerContainer} onPress={handleClose}>
          <ScrollView
            style={styles.zoomScroll}
            contentContainerStyle={{ flex: 1 }}
            maximumZoomScale={4}
            minimumZoomScale={1}
            onScroll={handleZoom}
            scrollEventThrottle={16}
          >
            <Animated.Image
              source={{ uri: currentImage! }}
              style={[styles.fullImage, { transform: [{ scale }] }]}
              resizeMode="contain"
            />
          </ScrollView>
        </Pressable>
      </Modal>
    </>
  );
};

export default Media;

const styles = StyleSheet.create({
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    gap: 8,
  },
  imageContainer: {
    width: 110,
    height: 110,
    backgroundColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  /* Fullscreen Viewer */
  viewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomScroll: {
    width: "100%",
    height: "100%",
  },
  fullImage: {
    width: width,
    height: height,
  },
});
