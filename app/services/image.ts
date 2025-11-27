import * as ImagePicker from "expo-image-picker";
import { supabase } from "./supabase";
import * as FileSystem from "expo-file-system";
export async function pickAndUploadImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (!result.canceled && result.assets.length > 0) {
    const imageUri = result.assets[0].uri;
    const uriParts = imageUri.split("/");
    const fileName = `${Date.now()}_${uriParts[uriParts.length - 1]}`;

    // Read file as base64
    const fileData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64", // <-- use string directly
    });

    // Convert to Uint8Array
    const blob = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));

    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("whatsapp")
      .upload(fileName, blob, {
        contentType: "image/jpeg", // optional
      });

    if (uploadError) {
      console.log("Upload error:", uploadError);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("whatsapp")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  return null;
}
