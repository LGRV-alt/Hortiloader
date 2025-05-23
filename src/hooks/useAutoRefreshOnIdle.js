import { useEffect, useRef } from "react";

export default function useAutoRefreshOnIdle(timeoutMs = 5 * 60 * 1000) {
  const timeoutRef = useRef();

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        console.log("Refresh");
        location.reload(); // 🔁 refresh page after idle timeout
      }, timeoutMs);
    };

    const activityEvents = [
      "mousemove",
      "keydown",
      "mousedown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Start the timer initially

    return () => {
      clearTimeout(timeoutRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [timeoutMs]);
}
