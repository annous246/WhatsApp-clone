import BackgroundService from "react-native-background-actions";
import { updateUserStatus } from "./user";

const logoutTask = async (taskData?: { uid: string }) => {
  const uid = taskData?.uid;
  if (!uid) return;
  await updateUserStatus(uid, false);
};

export async function logoutSeparateThread(uid: string) {
  if (!BackgroundService) {
    console.warn("BackgroundService not available (native module missing)");
    return;
  }

  await BackgroundService.start(logoutTask, {
    taskName: "LogoutTask",
    taskTitle: "Logging out",
    taskDesc: "Marking user offline",
    taskData: { uid },
  });
}
