import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomButton from "@/app/components/customButton";
import icons from "../../constants/icons";
import AnaliticsController from "../AnaliticsController";
import ProgressBar from "../statusBar/ProgressBar";
import AnimatedBar from "../statusBar/AnimatedBar";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "@/app/context/AuthProvider";
const { height: screenWidth, height: screenHeight } = Dimensions.get("window");
const Scroller1 = ({
  setNext: setNext,
  pagination: pagination,
}: {
  setNext: any;
  pagination: number;
}) => {
  const AuthSettings = useContext(AuthContext);
  const [height, setHeight] = useState<number>(AuthSettings.user?.height);
  useEffect(() => {
    AuthSettings.setUser((prev: any) => {
      return { ...prev, height: height };
    });
  }, [height]);
  function handleHeight(currentHeight: string) {
    if (!currentHeight || !currentHeight.length) {
      {
        setHeight(0);
        return;
      }
    }

    if (isNaN(parseInt(currentHeight))) return;
    const inputHeight = parseInt(currentHeight);
    if (inputHeight >= 0 && inputHeight < 1000) {
      setHeight(inputHeight);
    }
  }
  const NextStyle = { width: 200, height: 100, backgroundColor: "blue" };
  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.pressableContainer}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "black",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: 0.75 * screenHeight,
          marginBottom: 500,
        }}
      >
        <View style={styles.animationContainer}>
          <Image source={icons.personHeight} style={styles.image} />
          <AnimatedBar
            title={"Height"}
            measurement={"CM"}
            value={1}
            height={height}
            pagination={pagination}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
          }}
        >
          <Text>Height</Text>
          <TextInput
            placeholderTextColor="#ff9b7c"
            style={styles.input}
            placeholder={"160cm"}
            keyboardType="numeric"
            value={height ? height.toString() : ""}
            onChangeText={handleHeight}
          />
        </View>
      </ScrollView>
    </Pressable>
  );
};

export default Scroller1;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: "100%",
    textAlign: "center",
  },
  animationContainer: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  image: {
    width: "80%",
    height: "100%",
    borderRadius: 10,
  },
  container: {
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "90%",
  },
  pressableContainer: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
});
