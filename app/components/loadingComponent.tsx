import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";

interface loadingInterface {
  loading?: boolean;
  text?: string;
}
const LoadingComponent = (props: loadingInterface) => {
  const loading = props.loading;
  const text = props.text;
  useEffect(() => {}, [loading]);
  return (
    <Modal
      transparent={true}
      style={styles.loadingContainer}
      animationType="fade"
      visible={loading}
    >
      <View style={styles.loadingContainer}>
        <View style={styles.loading}>
          <ActivityIndicator size={50} color="#fff" />
          <Text
            style={{
              color: "white",
              transform: "translateY(20%)",
              fontSize: 20,
              textAlign: "center",
              maxWidth: "100%",
            }}
          >
            {text ? text : ""}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingComponent;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    zIndex: 2104545450,
  },
  loading: {
    backgroundColor: "rgba(121, 121, 121, 0.35)",
    maxHeight: 300,
    maxWidth: 300,
    padding: "20%",
    borderRadius: 7,
    alignItems: "center",
  },
});
