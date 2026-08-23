import { useEffect, useRef } from "react";
import { signout } from "../api/pocketbase";

export default function useAutoRefreshOnIdleAndDaily({
  idleTimeoutMs = 6 * 60 * 30 * 1000, //3 Hours
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
      window.addEventListener(event, resetIdleTimer),
    );

    resetIdleTimer();

    // DAILY AUTO REFRESH
    // Checked immediately on mount (not just on the interval) so a browser
    // reopened after being closed overnight is caught right away, rather
    // than staying signed in for up to checkDailyEveryMs before the next
    // interval tick notices the date changed.
    const checkDailyRefresh = () => {
      const todayCheck = new Date().toISOString().slice(0, 10);
      const lastCheck = localStorage.getItem("lastAppRefreshDate");

      if (!lastCheck) {
        console.log("[AutoRefresh] Setting initial daily refresh date.");
        localStorage.setItem("lastAppRefreshDate", todayCheck);
        return;
      }

      if (lastCheck !== todayCheck) {
        console.warn(
          "[AutoRefresh] New day detected. Signing out and refreshing app...",
        );
        localStorage.setItem("lastAppRefreshDate", todayCheck);
        signout();
        location.reload();
      }
    };

    checkDailyRefresh();
    intervalRef.current = setInterval(checkDailyRefresh, checkDailyEveryMs);

    // CLEANUP
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer),
      );
    };
  }, [idleTimeoutMs, checkDailyEveryMs]);
}
