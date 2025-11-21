import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import icons from "../constants/icons";
interface iconInterface {
  height: number;
  width: number;
  uri: string;
}
interface customButtonProps {
  title?: string;
  disabled?: boolean;
  currentIcon?: iconInterface;
  style?: object;
  iconStyle?: object;
  textStyle?: object;
  onPress?: () => void;
}
const CustomButton = (props: customButtonProps) => {
  const title = props.title;
  const currentIcon = props.currentIcon;
  const [style, setStyle] = useState<object>(props.style ? props.style : {});
  const iconStyle = props.iconStyle;
  const textStyle = props.textStyle;
  const disabled = props.disabled;
  const onPress = props.onPress;
  useEffect(() => {
    if (disabled) {
      if (style) {
        setStyle((prev) => {
          return { ...prev, opacity: 0.5 };
        });
      }
    } else {
      if (style) {
        setStyle((prev) => {
          return { ...prev, opacity: 1 };
        });
      }
    }
  }, [disabled]);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      disabled={disabled ? disabled : false}
    >
      {currentIcon && (
        <Image style={iconStyle} resizeMode="contain" source={currentIcon} />
      )}
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
