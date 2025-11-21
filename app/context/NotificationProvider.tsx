import { StyleSheet } from "react-native";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import NotificationBar from "../components/NotificationBar";
import { emitter } from "../services/emitter";

interface NotificationContextType {
  notify: (message: string, type: number) => void;
}

const notificationContext = createContext<NotificationContextType>({
  notify: () => {},
});

const NotificationProvider = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const notify = (msg: string, t: number) => {
      emitter.emit("notify", { message: msg, type: t });
    };

    return (
      <notificationContext.Provider value={{ notify }}>
        {children}
      </notificationContext.Provider>
    );
  }
);

export { NotificationProvider, notificationContext };

const styles = StyleSheet.create({});
