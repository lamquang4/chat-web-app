import { useState, useRef, useEffect } from "react";
import { Pause, Play } from "lucide-react";
import type { MessageAttachmentResponse } from "../../../../types/types";
import Button from "../../../ui/Button";
import { formatDuration } from "../../../../utils/formatters";

type Props = {
  att: MessageAttachmentResponse;
};

const BAR_COUNT = 24;

function AudioAttachment({ att }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration) || audio.duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(
      0,
      Math.min(ratio * audio.duration, audio.duration),
    );
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }

    const onTimeUpdate = () => {
      const cur = audio.currentTime;
      const dur = audio.duration;
      setCurrentTime(cur);
      setProgress(isFinite(dur) && dur > 0 ? (cur / dur) * 100 : 0);

      if (isFinite(dur) && dur > 0) setDuration(dur);
    };

    const onLoaded = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
    height: 30 + Math.abs(Math.sin(i * 0.8 + 1.2)) * 70,
    filled: (i / BAR_COUNT) * 100 <= progress,
  }));

  const displayTime =
    isPlaying || currentTime > 0
      ? formatDuration(Math.max(0, duration - currentTime))
      : formatDuration(duration);

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 w-auto h-full">
      <audio ref={audioRef} src={att.url} preload="metadata" />

      <Button
        onClick={toggle}
        aria-label={isPlaying ? "Tạm dừng" : "Phát"}
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors bg-primary"
      >
        {isPlaying ? (
          <Pause size={14} className="text-white" fill="white" />
        ) : (
          <Play size={14} className="text-white ml-0.5" fill="white" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div
          className="flex items-center gap-1 h-6 cursor-pointer mb-1"
          onClick={handleSeek}
          role="slider"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Tiến trình audio"
        >
          {bars.map((bar, i) => (
            <div
              key={i}
              className={`w-[3px] rounded-full transition-colors duration-100 shrink-0
                ${bar.filled ? "bg-primary" : "bg-gray-300"}`}
              style={{ height: `${bar.height}%` }}
            />
          ))}
        </div>
      </div>

      <span className="tabular-nums shrink-0">{displayTime}</span>
    </div>
  );
}

export default AudioAttachment;
