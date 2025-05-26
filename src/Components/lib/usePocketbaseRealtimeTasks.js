import { useEffect, useRef, useState } from "react";
import pb from "./pbConnect";

export default function usePocketbaseRealtimeTasks() {
  const [records, setRecords] = useState([]);
  const unsubscribeRef = useRef(null);
  const isConnecting = useRef(false);
  const reconnectAttempts = useRef(0);
  const maxRetries = 5;
  const baseDelay = 1000;

  const fetchInitialTasks = async () => {
    try {
      const tasks = await pb
        .collection("tasks")
        .getFullList({ sort: "created" });
      setRecords(tasks);
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err);
    }
  };

  const handleRealtime = (e) => {
    console.log("📡 Realtime update:", e);

    setRecords((prev) => {
      switch (e.action) {
        case "create":
          return [e.record, ...prev];
        case "update":
          return prev.map((item) =>
            item.id === e.record.id ? { ...e.record } : item
          );
        case "delete":
          return prev.filter((item) => item.id !== e.record.id);
        default:
          return prev;
      }
    });
  };

  const subscribe = async () => {
    if (isConnecting.current) return;
    isConnecting.current = true;

    try {
      console.log("🔌 Connecting to PocketBase realtime...");

      await pb.realtime.disconnect();
      await pb.realtime.connect();

      if (unsubscribeRef.current) {
        await unsubscribeRef.current();
      }

      unsubscribeRef.current = await pb
        .collection("tasks")
        .subscribe("*", handleRealtime);

      reconnectAttempts.current = 0;
      console.log("✅ Subscribed to 'tasks'");
    } catch (err) {
      console.error("❌ Realtime subscribe failed:", err);
      if (reconnectAttempts.current < maxRetries) {
        const delay = baseDelay * 2 ** reconnectAttempts.current;
        reconnectAttempts.current += 1;
        console.log(
          `⏳ Retry in ${delay}ms (attempt ${reconnectAttempts.current})`
        );
        setTimeout(subscribe, delay);
      } else {
        console.warn("🔥 Max retry attempts reached");
      }
    } finally {
      isConnecting.current = false;
    }
  };

  useEffect(() => {
    fetchInitialTasks();
    subscribe();

    const watchdog = setInterval(() => {
      const socket = pb.realtime.client;
      if (!socket || socket.readyState !== 1) {
        console.warn("👀 Watchdog: socket dropped. Reconnecting...");
        subscribe();
      }
    }, 15000); // every 15 seconds

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        const socket = pb.realtime.client;
        if (!socket || socket.readyState !== 1) {
          console.warn("👁️ Page became visible. Reconnecting...");
          subscribe();
        }
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    const authUnsub = pb.authStore.onChange(() => {
      if (!pb.authStore.isValid) {
        console.warn("🔐 Auth token expired. You may need to refresh.");
      }
    });

    return () => {
      console.log("🧹 Cleanup");
      if (unsubscribeRef.current) unsubscribeRef.current();
      clearInterval(watchdog);
      document.removeEventListener("visibilitychange", onVisibility);
      authUnsub();

      // Gracefully disconnect
      try {
        pb.realtime.disconnect();
      } catch (e) {
        console.warn("⚠️ Realtime disconnect failed", e);
      }
    };
  }, []);

  return records;
}
