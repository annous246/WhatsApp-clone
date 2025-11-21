import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Scroller1 from "./Scrollers/Scroller1";
import Scroller2 from "./Scrollers/Scroller2";
import Scroller3 from "./Scrollers/Scroller3";
import ProgressBar from "./statusBar/ProgressBar";
import Scroller4 from "./Scrollers/Scroller4";
import Scroller5 from "./Scrollers/Scroller5";

const ScrollerContainer = ({
  setNext: setNext,
  pagination: pagination,
}: {
  pagination: number;
  setNext: any;
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const containerRef = useRef<any>(null);
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("animate");
    console.log(pagination);
    Animated.timing(translation, {
      toValue: -screenWidth * pagination,
      duration: 300,
      useNativeDriver: true,
    }).start();
    /*
    containerRef.current.style.transform = `translateX(${
      (pagination - 1) * 100
    }%`;*/
  }, [pagination]);
  return (
    <Animated.View
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "85%",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        transform: [{ translateX: translation }],
      }}
    >
      <Scroller1 setNext={setNext} pagination={pagination} />
      <Scroller2 setNext={setNext} pagination={pagination} />
      <Scroller3 setNext={setNext} pagination={pagination} />
      <Scroller5 setNext={setNext} pagination={pagination} />
      <Scroller4 pagination={pagination} />
    </Animated.View>
  );
};

export default ScrollerContainer;

const styles = StyleSheet.create({});
