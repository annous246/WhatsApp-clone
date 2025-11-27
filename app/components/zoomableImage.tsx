import React, { useState } from "react";
import { View, Image, Modal, TouchableOpacity, StyleSheet } from "react-native";

type ZoomableImageProps = {
  uri: string;
};

const ZoomableImage = ({ uri }: ZoomableImageProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const v = "azd";
  return (
    <View style={{ marginVertical: 5 }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri }}
          style={{ width: 200, height: 200, borderRadius: 15 }}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true}>
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ZoomableImage;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
});
