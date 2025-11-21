import { StyleSheet, Text, View } from "react-native";
import React, { createContext, useState } from "react";
interface DateContextType {
  currentDate: Date;
  setCurrentDate?: any;
}
const DateContext = createContext<DateContextType>({
  currentDate: new Date(),
  setCurrentDate: null,
});
interface props {
  children: any;
}
const DateProvider = ({ children: children }: props) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return (
    <DateContext.Provider
      value={{ currentDate: currentDate, setCurrentDate: setCurrentDate }}
    >
      {children}
    </DateContext.Provider>
  );
};

export { DateProvider, DateContext };

const styles = StyleSheet.create({});
