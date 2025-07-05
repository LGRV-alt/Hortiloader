import { useEffect, useRef } from "react";

export default function useAutoRefreshOnIdleAndDaily({
  idleTimeoutMs = 6 * 60 * 60 * 1000, // 6 Hours
  checkDailyEveryMs = 1 * 60 * 60 * 1000, // 1 Hour
} = {}) {
  const timeoutRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    // ✅ IDLE AUTO REFRESH
    const resetIdleTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        console.log("[AutoRefresh] Refreshing due to idle timeout.");
        location.reload();
      }, idleTimeoutMs);
    };

    const activityEvents = [
      "mousemove",
      "keydown",
      "mousedown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetIdleTimer)
    );

    resetIdleTimer();

    // DAILY AUTO REFRESH
    // Initialize daily refresh date on first load, if missing
    const today = new Date().toISOString().slice(0, 10);
    const lastRefresh = localStorage.getItem("lastAppRefreshDate");

    if (!lastRefresh) {
      console.log("[AutoRefresh] Setting initial daily refresh date.");
      localStorage.setItem("lastAppRefreshDate", today);
    }

    intervalRef.current = setInterval(() => {
      const todayCheck = new Date().toISOString().slice(0, 10);
      const lastCheck = localStorage.getItem("lastAppRefreshDate");

      console.log(
        `[AutoRefresh] Daily check running... Today: ${todayCheck}, Last: ${lastCheck}`
      );

      if (lastCheck !== todayCheck) {
        console.warn("[AutoRefresh] New day detected. Refreshing app...");
        localStorage.setItem("lastAppRefreshDate", todayCheck);
        location.reload();
      }
    }, checkDailyEveryMs);

    // CLEANUP
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
    };
  }, [idleTimeoutMs, checkDailyEveryMs]);
}
