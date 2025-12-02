import Sound from "react-native-sound";
import { TouchableOpacity, Text } from "react-native";
import { useEffect, useState } from "react";

function AudioMessage({ url }: { url: string }) {
  const [sound, setSound] = useState<Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (sound) sound.release(); // Cleanup on unmount
    };
  }, [sound]);

  const playAudio = () => {
    if (playing) return;

    const newSound = new Sound(url, undefined, (error) => {
      if (error) {
        console.warn("Failed to load the sound", error);
        return;
      }

      // 1️⃣ Get audio duration (in seconds)
      const audioDuration = newSound.getDuration();
      setDuration(audioDuration);
      setTimeLeft(audioDuration);

      setSound(newSound);
      setPlaying(true);

      // 2️⃣ Start countdown
      let interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev == null) return null;

          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 3️⃣ Play audio
      newSound.play((success) => {
        clearInterval(interval);
        setPlaying(false);
        setTimeLeft(null);

        if (!success) console.warn("Playback failed");

        newSound.release();
      });
    });
  };

  return (
    <TouchableOpacity
      onPress={playAudio}
      style={{ padding: 10, backgroundColor: "#eee", borderRadius: 8 }}
    >
      {duration != null && timeLeft != null && playing ? (
        <Text>{`Playing... ${timeLeft.toFixed(1)}s / ${duration.toFixed(
          1
        )}s`}</Text>
      ) : duration != null ? (
        <Text>{`Play Audio (${duration.toFixed(1)}s)`}</Text>
      ) : (
        <Text>Play Audio</Text>
      )}
    </TouchableOpacity>
  );
}

export default AudioMessage;
