import { useRef, useState, useCallback, useEffect } from "react";
import { RECORDING_MIME_TYPE } from "../constants/limit";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());

      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = null;
        recorder.stop();
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream, {
      mimeType: RECORDING_MIME_TYPE,
    });
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setIsPaused(false);
    setElapsed(0);
    setAudioBlob(null);
    setAudioUrl(null);
    startTimer();
  }, []);

  const togglePauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (isPaused) {
      recorder.resume();
      startTimer();
      setIsPaused(false);
    } else {
      recorder.pause();
      stopTimer();
      setIsPaused(true);
    }
  }, [isPaused]);

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  // Dừng hẳn ghi âm chuyển sang trạng thái preview
  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return resolve(null);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: RECORDING_MIME_TYPE,
        });
        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);
        stopTimer();
        releaseStream();
        setIsRecording(false);
        setIsPaused(false);
        mediaRecorderRef.current = null;
        audioUrlRef.current = url;
        resolve(blob);
      };
      recorder.stop();
    });
  }, []);

  // Hủy hoàn toàn, không giữ lại gì
  const cancel = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }
    stopTimer();
    releaseStream();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioUrlRef.current = null;
    mediaRecorderRef.current = null;
    setIsRecording(false);
    setIsPaused(false);
    setElapsed(0);
    setAudioBlob(null);
    setAudioUrl(null);
  }, [audioUrl]);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    audioUrlRef.current = null;
    setElapsed(0);
  }, [audioUrl]);

  return {
    isRecording,
    isPaused,
    elapsed,
    audioBlob,
    audioUrl,
    start,
    togglePauseRecording,
    stopRecording,
    cancel,
    reset,
  };
}
