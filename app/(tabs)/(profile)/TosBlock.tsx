import {
  ImageSourcePropType,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Line from "@/app/components/Line";

const TosBlock = ({
  title,
  content,
  icon,
}: {
  title: string;
  content: string;
  icon: ImageSourcePropType;
}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "flex-start",
          alignSelf: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <Image
          source={icon}
          style={{ alignSelf: "center", width: 20, height: 20 }}
        />
        <Text style={{ fontWeight: "bold", marginLeft: 20 }}>{title}</Text>
      </View>
      <Line width={"100%"} height={1} marginTop={10} marginBottom={10} />
      <Text>{content}</Text>
    </View>
  );
};

export default TosBlock;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: "auto",
    backgroundColor: "white",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginVertical: 10,
    borderRadius: 8,
    padding: 20,
  },
});
