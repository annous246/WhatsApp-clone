import { supabase } from "./supabase";
import RNFS from "react-native-fs";
import { launchImageLibrary } from "react-native-image-picker";

export async function pickAndUploadImage() {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      launchImageLibrary(
        {
          mediaType: "photo", // only images
          quality: 0.8,
        },
        (response) => {
          if (response.didCancel) return resolve(null);
          if (response.errorCode) return reject(response.errorMessage);
          resolve(response);
        }
      );
    });

    if (!result || !result.assets || result.assets.length === 0) return null;

    const imageUri = result.assets[0].uri;
    const uriParts = imageUri.split("/");
    const fileName = `${Date.now()}_${uriParts[uriParts.length - 1]}`;

    // Read file as base64
    const fileData = await RNFS.readFile(imageUri, "base64");

    // Convert to Uint8Array
    const blob = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));

    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("whatsapp")
      .upload(fileName, blob, { contentType: "image/jpeg" });

    if (uploadError) {
      console.log("Upload error:", uploadError);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("whatsapp")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (e) {
    console.log("Pick/upload error:", e);
    return null;
  }
}
