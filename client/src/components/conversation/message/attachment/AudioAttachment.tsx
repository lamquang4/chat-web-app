import { useState, useRef, useEffect, useMemo } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import type { MessageAttachmentResponse } from "../../../../types/types";
import Button from "../../../ui/Button";
import { formatDuration } from "../../../../utils/formatters";

interface Props {
  att: MessageAttachmentResponse;
  isMe: boolean;
}

const BAR_COUNT = 24;

function AudioAttachment({ att, isMe }: Props) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(att.duration ?? 0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
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

    const onTimeUpdate = () => {
      const cur = audio.currentTime;
      const dur = audio.duration;
      setCurrentTime(cur);
      setProgress(isFinite(dur) && dur > 0 ? (cur / dur) * 100 : 0);
      if (isFinite(dur) && dur > 0) setDuration(dur);
    };

    const syncDurationFromAudio = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", syncDurationFromAudio);
    audio.addEventListener("durationchange", syncDurationFromAudio);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("playing", onCanPlay);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", syncDurationFromAudio);
      audio.removeEventListener("durationchange", syncDurationFromAudio);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("playing", onCanPlay);
    };
  }, []);

  const barHeights = useMemo(
    () =>
      Array.from(
        { length: BAR_COUNT },
        (_, i) => 30 + Math.abs(Math.sin(i * 0.8 + 1.2)) * 70,
      ),
    [],
  );

  const displayTime =
    isPlaying || currentTime > 0
      ? formatDuration(Math.max(0, duration - currentTime))
      : formatDuration(duration);

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 w-auto h-full">
      <audio ref={audioRef} src={att.url} preload="auto" />

      <Button
        onClick={toggle}
        aria-label={isPlaying ? "Tạm dừng" : "Phát"}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isPlaying ? "bg-primary" : "bg-primary"} `}
      >
        {isPlaying ? (
          <Pause size={16} className="text-white" fill="white" />
        ) : (
          <Play size={16} className="text-white ml-0.5" fill="white" />
        )}
      </Button>

      <div
        className="flex-1 min-w-0 flex items-center gap-1 h-6 cursor-pointer relative"
        onClick={handleSeek}
        role="slider"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Tiến trình audio"
      >
        {barHeights.map((height, i) => {
          const filled = (i / BAR_COUNT) * 100 <= progress;
          return (
            <div
              key={i}
              className={`w-[3px] rounded-full transition-colors duration-100 shrink-0 ${
                isMe
                  ? filled
                    ? "bg-white"
                    : "bg-white/40"
                  : filled
                    ? "bg-primary"
                    : "bg-gray-300"
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      {isBuffering ? (
        <Loader2 size={14} className="shrink-0 animate-spin text-primary" />
      ) : (
        <span className="font-medium">{displayTime}</span>
      )}
    </div>
  );
}

export default AudioAttachment;
