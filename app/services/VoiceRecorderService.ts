import React, { useState } from "react";
import { Platform, PermissionsAndroid, ToastAndroid } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import RNFS from "react-native-fs";

// Helper function to generate the file path (using app's document directory)
const getFilePath = (uid: string) => {
  const directoryPath = RNFS.DocumentDirectoryPath;
  const fileName = `${uid}_${Date.now()}.mp3`;
  return `${directoryPath}/${fileName}`;
};

// Request Storage Permission (For Android 6.0+)
async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "This app needs access to your storage to save recordings.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Storage permission granted");
      return true;
    } else {
      console.log("Storage permission denied");
      ToastAndroid.show(
        "Storage permission denied. Cannot record audio.",
        ToastAndroid.SHORT
      );
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

// Start recording function
export async function startRecording(uid: string) {
  const path = getFilePath(uid);

  // Request storage permission before starting the recording
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) return;

  try {
    // Start the recording
    await AudioRecorderPlayer.startRecorder(path);
    console.log("Recording started at: " + path);
  } catch (error) {
    console.error("Error starting the recording: ", error);
  }

  return path; // return the file path where the audio is being saved
}

// Stop recording function and move the file to Downloads folder
export async function stopRecording(): Promise<string> {
  try {
    // Stop the recording and get the result (file path)
    const result = await AudioRecorderPlayer.stopRecorder();
    console.log("Recording stopped, saved at: " + result);

    // Define the path to move the file to Downloads folder (external storage)
    const downloadPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${result
      .split("/")
      .pop()}`;

    // Check if Downloads directory exists, create it if it doesn't
    const downloadsDir = `${RNFS.ExternalStorageDirectoryPath}/Download`;
    const dirExists = await RNFS.exists(downloadsDir);
    if (!dirExists) {
      await RNFS.mkdir(downloadsDir);
    }

    // Move the file to Downloads folder
    await RNFS.moveFile(result, downloadPath);

    console.log(`File moved to Downloads: ${downloadPath}`);

    // Optionally show a toast on Android confirming the file location
    if (Platform.OS === "android") {
      ToastAndroid.show(`Recording saved in Downloads`, ToastAndroid.SHORT);
    }

    return downloadPath; // Return the new path to the Downloads folder
  } catch (error) {
    console.error("Error stopping the recording: ", error);
    throw error;
  }
}
