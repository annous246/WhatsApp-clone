import { StyleSheet, View } from "react-native";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import NotificationBar from "../components/NotificationBar";
import { emitter } from "../services/emitter";

interface NotificationViewContextType {
  notify: (message: string, type: number) => void;
}

const notificationViewContext = createContext<NotificationViewContextType>({
  notify: () => {},
});

const NotificationView = React.memo(() => {
  const [popup, setPopup] = useState(false);
  const [actualPop, setActualPop] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState(0);

  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current.length = 0;
  }, []);

  const popGate = useCallback(
    (state: boolean) => {
      clearAllTimeouts();

      if (state) {
        setPopup(false);

        const id = setTimeout(() => {
          setPopup(true);
          setActualPop(true);
        }, 200);

        const id1 = setTimeout(() => {
          setPopup(false);
        }, 3000);

        timeoutIds.current.push(id, id1);
      } else {
        setActualPop(true);
        setPopup(true);

        const id3 = setTimeout(() => {
          setPopup(false);
        }, 3000);

        timeoutIds.current.push(id3);
      }
    },
    [clearAllTimeouts]
  );

  const notify = useCallback(
    (msg: string, t: number) => {
      if (![0, 1, 2].includes(t) || !msg) return;
      setMessage(msg);
      setType(t);

      if (popup) {
        popGate(true);
      } else {
        popGate(false);
      }
    },
    [popup, popGate]
  );
  useEffect(() => {
    let id: any;
    if (!popup) {
      id = setTimeout(() => {
        setActualPop(false);
      }, 200);
    }

    return () => clearTimeout(id);
  }, [popup]);
  useEffect(() => {
    const handler = (data: { message: string; type: number }) => {
      notify(data.message, data.type);
    };

    emitter.on("notify", handler);
    return () => {
      emitter.off("notify", handler);
    };
  }, []);

  return (
    <>
      {actualPop && (
        <NotificationBar
          popup={popup}
          message={message}
          type={type}
          setPopup={setActualPop}
        />
      )}
    </>
  );
});

export default NotificationView;

const styles = StyleSheet.create({});
