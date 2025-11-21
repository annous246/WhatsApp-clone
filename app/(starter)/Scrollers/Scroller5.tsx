import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomButton from "@/app/components/customButton";
import icons from "../../constants/icons";
import AnaliticsController from "../AnaliticsController";
import ProgressBar from "../statusBar/ProgressBar";
import AnimatedBar from "../statusBar/AnimatedBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "@/app/context/AuthProvider";
import animations from "@/app/constants/animations";
import LottieView from "lottie-react-native";
import VerticalLine from "@/app/components/VerticalLine";

const { height: screenWidth, height: screenHeight } = Dimensions.get("window");
const Scroller5 = ({
  setNext: setNext,
  pagination: pagination,
}: {
  setNext: any;
  pagination: number;
}) => {
  const AuthSettings = useContext(AuthContext);
  const [male, setMale] = useState<boolean>(AuthSettings.user?.gender);
  useEffect(() => {
    AuthSettings.setUser((prev: any) => {
      return { ...prev, gender: male };
    });
  }, [male]);
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
          <TouchableOpacity
            style={{
              width: "50%",
              height: "100%",
              borderRadius: 10,
              marginRight: 10,
              overflow: "hidden",
            }}
            onPress={() => setMale(true)}
          >
            <LottieView
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: male ? "#3455eb" : "white",
                opacity: male ? 0.9 : 0.5,
              }}
              autoPlay
              loop={true}
              source={animations.male}
            />
          </TouchableOpacity>
          <VerticalLine
            marginInline={0}
            height={"50%"}
            width={1}
            color="gray"
          />
          <TouchableOpacity
            style={{
              width: "50%",
              height: "100%",
              borderRadius: 10,
              marginLeft: 10,
              overflow: "hidden",
            }}
            onPress={() => setMale(false)}
          >
            <LottieView
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: !male ? "#eb3a34" : "white",
                opacity: !male ? 0.9 : 0.5,
              }}
              autoPlay
              loop={true}
              source={animations.female}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
          }}
        >
          <Text style={{ textAlign: "center", marginTop: 15 }}>
            Please Select Your Gender At Birth
          </Text>
        </View>
      </ScrollView>
    </Pressable>
  );
};

export default Scroller5;

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
    marginTop: 10,
  },
});
