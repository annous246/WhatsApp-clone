import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import Line from "../../components/Line";
import Dot from "./Dot";

const ProgressBar = ({ pagination: pagination }: { pagination: number }) => {
  useEffect(() => {
    console.log("pagination");
    console.log(pagination);
  }, [pagination]);
  return (
    <View style={styles.container}>
      <Dot pagination={pagination} value={1} />
      <Line
        backgroundColor="transparent"
        width={20}
        height={3}
        marginBottom={0}
        marginTop={0}
      />

      <Dot pagination={pagination} value={2} />
      <Line
        backgroundColor="transparent"
        width={20}
        height={3}
        marginBottom={0}
        marginTop={0}
      />

      <Dot pagination={pagination} value={3} />
      <Line
        backgroundColor="transparent"
        width={20}
        height={3}
        marginBottom={0}
        marginTop={0}
      />

      <Dot pagination={pagination} value={4} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    zIndex: 500,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    marginInline: 10,
    width: 10,
    height: 10,
    borderRadius: 100,
    borderWidth: 1,
  },
});
