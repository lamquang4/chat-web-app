import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Square } from "lucide-react";
import Button from "../../../ui/Button";

type Props = {
  isRecording: boolean;
  elapsed: number;
  audioUrl: string | null;
  onCancel: () => void;
  onStop: () => void;
  onDelete: () => void;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioPreview({
  isRecording,
  elapsed,
  audioUrl,
  onCancel,
  onStop,
  onDelete,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isRecording) return;

    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl, isRecording]);

  useEffect(() => {
    let raf = 0;
    raf = requestAnimationFrame(() => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    });
    return () => cancelAnimationFrame(raf);
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const displayTime = isRecording
    ? elapsed
    : isPlaying || currentTime > 0
      ? currentTime
      : duration;

  return (
    <div className="flex items-center gap-2 w-full">
      <Button
        onClick={isRecording ? onCancel : onDelete}
        className="p-1.5 rounded-full text-neutral bg-gray-100 hover:bg-primary hover:text-white"
      >
        <X size={20} />
      </Button>

      <div className="flex-1 flex items-center gap-3 bg-primary rounded-full p-2">
        <Button
          onClick={isRecording ? onStop : togglePlay}
          className="p-1.5 rounded-full bg-white text-primary shrink-0"
        >
          {isRecording ? (
            <Square size={16} className="fill-primary" />
          ) : isPlaying ? (
            <Pause size={18} className="fill-primary" />
          ) : (
            <Play size={18} className="fill-primary" />
          )}
        </Button>

        <div className="flex-1 h-1 rounded-full overflow-hidden bg-gray-300">
          <div
            className={`h-full bg-white rounded-full ${
              isRecording ? "w-full animate-pulse" : ""
            }`}
            style={isRecording ? undefined : { width: `${progress * 100}%` }}
          />
        </div>

        <span className="text-primary font-medium bg-white px-2 py-0.5 rounded-full shrink-0">
          {formatTime(displayTime)}
        </span>
      </div>

      {!isRecording && audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
    </div>
  );
}

export default AudioPreview;
