import { StyleSheet, Text, View } from "react-native";
import React from "react";
import icons from "@/app/constants/icons";
import TosBlock from "./TosBlock";
import { ScrollView } from "react-native-gesture-handler";
import { Link } from "expo-router";
import tos from "../../constants/tos";
const Terms = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Link
        href="/profile"
        style={{
          fontSize: 10,
          textAlign: "left",
          marginVertical: 10,
          width: "90%",
        }}
      >
        last Update 15/04/2025
      </Link>
      <TosBlock title="Conditions of use" icon={icons.cou} content={tos.COU} />
      <TosBlock title="Privacy policy" icon={icons.pp} content={tos.PP} />
      <TosBlock
        title="Intellectual property"
        icon={icons.ipp}
        content={tos.IPP}
      />
    </ScrollView>
  );
};

export default Terms;

const styles = StyleSheet.create({});
