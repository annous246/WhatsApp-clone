import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import NotificationBar from "../components/NotificationBar";

const useNotificationController = () => {
  const [popup, setPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<number>(0);
  const [actualPop, setActualPop] = useState<boolean>(popup);

  useEffect(() => {
    let delay = 0;
    let id: any;
    let ids: any;
    console.log("popup");
    console.log(popup);
    if (popup) {
      id = setTimeout(() => {
        setPopup(false);
      }, 3000);
      setActualPop(popup);
    } else {
      ids = setTimeout(() => {
        setActualPop(popup);
      }, 200);
    }
    return () => {
      clearTimeout(id);
      clearTimeout(ids);
    };
  }, [popup]);

  function notify(message: string, type: number) {
    console.log("called");
    if ((type != 0 && type != 1 && type != 2) || !message) return;
    setMessage(message);
    setType(type);
    setPopup((prev) => !prev); /*
        setTimeout(() => {
          console.log("far");
          setPopup(true);
        }, 200);*/
  }
  const Notification = actualPop ? (
    <NotificationBar
      message={message}
      type={type}
      popup={popup}
      setPopup={setPopup}
    />
  ) : null;
  return { notify, Notification };
};

export default useNotificationController;

const styles = StyleSheet.create({});
