import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomButton from "../components/customButton";
import { Colors } from "react-native/Libraries/NewAppScreen";

const AnaliticsController = ({
  setNext: setNext,
  setPrevious: setPrevious,
  pagination: pagination,
  loading: loading,
}: {
  setNext: any;
  setPrevious: any;
  pagination: number;
  loading: boolean;
}) => {
  const buttonStyle = {
    padding: 10,
    backgroundColor: "#374bff",
    width: "40%",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 10,
  };
  const textButton = {
    color: "white",
    textAlign: "center",
  };
  const previousTextButton = {
    color: "gray",
    textAlign: "center",
  };
  const prevButtonStyle = {
    padding: 10,
    backgroundColor: "white",
    width: "40%",
    color: "gray",
    borderWidth: 1,
    borderColor: "gray",
    textAlign: "center",
    borderRadius: 10,
  };

  return (
    <View style={styles.container}>
      <CustomButton
        title="Previous"
        style={prevButtonStyle}
        textStyle={previousTextButton}
        onPress={() => {
          setPrevious(true);
        }}
        disabled={pagination == 0 || loading}
      />
      <CustomButton
        title={pagination + 1 != 5 ? "Next" : "Finish"}
        style={buttonStyle}
        textStyle={textButton}
        onPress={() => {
          console.log("next");
          setNext(true);
        }}
        disabled={pagination == 5 || loading}
      />
    </View>
  );
};

export default AnaliticsController;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    width: "100%",
    height: "10%",
  },
});
