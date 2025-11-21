import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from "react-native";
import animations from "../../constants/animations";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const { height: screenWidth, height: screenHeight } = Dimensions.get("window");
const Scroller4 = ({ pagination: pagination }: { pagination: number }) => {
  const NextStyle = { width: 200, height: 100, backgroundColor: "blue" };
  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.pressableContainer}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: 0.75 * screenHeight,
          marginBottom: 500,
        }}
      >
        {pagination + 1 == 5 && (
          <>
            <LottieView
              style={{ width: "80%", height: "80%", backgroundColor: "white" }}
              autoPlay
              loop={false}
              source={animations.greenTick}
            ></LottieView>

            <Text>Looks good?</Text>
            <Text style={styles.text}> Hit Finish and let's go!</Text>
          </>
        )}
      </ScrollView>
    </Pressable>
  );
};

export default Scroller4;

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    textAlign: "center",
    fontFamily: "monospace",
  },
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
