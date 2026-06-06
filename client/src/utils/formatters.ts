export function formatFileSize(bytes: number): string | null {
  if (bytes > 10 * 1024 * 1024) return "File không được vượt quá 10MB";
  return null;
}

export function formatImageSize(bytes: number): string | null {
  if (bytes > 5 * 1024 * 1024) return "Ảnh không được vượt quá 5MB";
  return null;
}

export function formatDuration(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
