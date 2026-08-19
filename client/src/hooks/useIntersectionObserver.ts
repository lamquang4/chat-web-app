import { useEffect, useRef } from "react";

interface Props {
  onIntersect: () => void;
  enabled?: boolean;
}

// hỗ trợ infinite scroll phát hiện người dùng đã cuộn tới gần cuối danh sách chưa
export function useIntersectionObserver({
  onIntersect,
  enabled = true,
}: Props) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      { threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return targetRef;
}
