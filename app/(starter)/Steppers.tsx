import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ScrollerContainer from "./ScrollerContainer";
import ProgressBar from "./statusBar/ProgressBar";
import AnaliticsController from "./AnaliticsController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StepperContext } from "../context/StepperProvider";
import { Post } from "../services/api";
import { AuthContext } from "../context/AuthProvider";
import Constants from "expo-constants";
import LoadingComponent from "../components/loadingComponent";

const { API_URL } = Constants.expoConfig?.extra;
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const Steppers = () => {
  console.log(API_URL);
  const StepperSettings = useContext(StepperContext);
  const AuthSettings = useContext(AuthContext);
  const [next, setNext] = useState<boolean>(false);
  const [previous, setPrevious] = useState<boolean>(false);
  const [pagination, setPagination] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function checkAge(): boolean {
    let age: any = AuthSettings.user.age ?? null;
    if (!age) return false;
    return age < 200 && age > 0;
  }
  async function checkHeight(): boolean {
    let height: any = AuthSettings.user.height ?? null;
    if (!height) return false;
    height = parseInt(height);
    return height < 1000 && height > 0;
  }
  async function checkWeight(): boolean {
    let weight: any = AuthSettings.user.weight ?? null;
    if (!weight) return false;
    return weight < 1000 && weight > 0;
  }
  async function checkPagination(page: number) {
    const check1 = await checkHeight();
    const check2 = await checkWeight();
    const check3 = await checkAge();
    console.log("checks");
    console.log(check1);
    console.log(check2);
    console.log(check3);
    let final = true;

    switch (page) {
      case 1:
        return check1;
        break;
      case 2:
        return check2;
        break;
      case 3:
        return check3;
        break;
    }
    return true;
  }
  async function changePage() {
    const checked = await checkPagination(pagination + 1);
    if (checked) setPagination((prev: number) => Math.min(4, prev + 1));

    setNext(false);
  }

  async function finilizeSteppers() {
    setLoading(true);
    let weight: any = AuthSettings.user.weight ?? null;
    let height: any = AuthSettings.user.height ?? null;
    let age: any = AuthSettings.user.age ?? null;
    let gender: any = AuthSettings.user.gender ?? null;
    console.log(API_URL + "/starter/stepper_finished");
    const res = await Post(API_URL + "/starter/stepper_finished", {
      user: AuthSettings.user,
      analytics: { height: height, weight: weight, gender: gender, age: age },
    });
    if (res.ok === 1) {
      setLoading(false);
      StepperSettings.setStepper(false);
    } else {
      //notify TODO
      console.log("error");
      console.log(res);
    }
  }

  useEffect(() => {
    if (next) {
      if (pagination == 4) {
        //finished
        console.log("final fct************");
        finilizeSteppers();
      } else changePage();
    }
  }, [next]);
  useEffect(() => {
    if (previous) {
      console.log("previous");
      console.log(previous);
      setPagination((prev: number) => Math.max(0, prev - 1));
      setPrevious(false);
    }
  }, [previous]);
  return (
    <View style={styles.container}>
      {true && (
        <LoadingComponent
          loading={loading}
          text="Saving Your Analytics  Please Wait"
        />
      )}
      <ProgressBar pagination={pagination} />
      <ScrollerContainer pagination={pagination} setNext={setNext} />
      <AnaliticsController
        pagination={pagination}
        setNext={setNext}
        setPrevious={setPrevious}
        loading={loading}
      />
    </View>
  );
};

export default Steppers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: screenWidth,
    height: screenHeight,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
