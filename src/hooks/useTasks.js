// import { useEffect, useRef, useState } from "react";
// import pb from "../Components/lib/pbConnect";

// export default function useTasks() {
//   const [records, setRecords] = useState([]);
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   const unsubscribeRef = useRef(null);
//   const isConnecting = useRef(false);
//   const watchdogInterval = useRef(null);

//   const fetchData = async () => {
//     try {
//       const tasks = await pb
//         .collection("tasks")
//         .getFullList({ sort: "created" });
//       setRecords(tasks);
//     } catch (err) {
//       console.error("❌ Failed to fetch tasks:", err);
//     }
//   };

//   const handleRealtimeUpdate = (e) => {
//     console.log("📡 Realtime event:", e);

//     setRecords((prev) => {
//       if (e.action === "create") {
//         return [e.record, ...prev];
//       } else if (e.action === "update") {
//         return prev.map((item) => (item.id === e.record.id ? e.record : item));
//       } else if (e.action === "delete") {
//         return prev.filter((item) => item.id !== e.record.id);
//       }
//       return prev;
//     });
//   };

//   const initRealtime = async () => {
//     if (isConnecting.current) return;
//     isConnecting.current = true;

//     try {
//       // Always reset connection before subscribing
//       await pb.realtime.disconnect(); // <- force disconnect stale socket
//       await pb.realtime.connect(); // <- reconnect to get a fresh clientId

//       // Unsubscribe previous if needed
//       if (unsubscribeRef.current) {
//         await unsubscribeRef.current();
//       }

//       // Subscribe to the "tasks" collection
//       unsubscribeRef.current = await pb
//         .collection("tasks")
//         .subscribe("*", handleRealtimeUpdate);

//       console.log("✅ Realtime subscribed to 'tasks'");
//       setIsSubscribed(true);
//     } catch (err) {
//       console.error("❌ Failed to subscribe to realtime:", err);
//       setIsSubscribed(false);
//     } finally {
//       isConnecting.current = false;
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     initRealtime();

//     // Watchdog to check connection every minute
//     watchdogInterval.current = setInterval(() => {
//       const socket = pb.realtime.client;
//       if (!socket || socket.readyState !== 1) {
//         console.warn("👀 Watchdog: reconnecting...");
//         initRealtime();
//       }
//     }, 60000);

//     // Page becomes visible again
//     const handleVisibility = () => {
//       if (document.visibilityState === "visible") {
//         const socket = pb.realtime.client;
//         if (!socket || socket.readyState !== 1) {
//           console.warn("👁️ Page visible, socket closed. Reconnecting...");
//           initRealtime();
//         }
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibility);

//     // Optional: monitor auth expiration
//     const authCleanup = pb.authStore.onChange(() => {
//       if (!pb.authStore.isValid) {
//         console.warn("🔐 Auth token expired. You may need to refresh.");
//       }
//     });

//     return () => {
//       if (unsubscribeRef.current) unsubscribeRef.current();
//       if (watchdogInterval.current) clearInterval(watchdogInterval.current);
//       document.removeEventListener("visibilitychange", handleVisibility);
//       authCleanup(); // Unsubscribe auth listener
//     };
//   }, []);

//   return records;
// }
// src/hooks/useTasks.js
// src/hooks/useTasks.js
import { useEffect, useRef, useState } from "react";
import pb from "../Components/lib/pbConnect";

export default function useTasks() {
  const [records, setRecords] = useState([]);

  const unsubscribeRef = useRef(null);
  const isConnecting = useRef(false);
  const reconnectAttempts = useRef(0);
  const watchdogInterval = useRef(null);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const BASE_RECONNECT_DELAY = 1000;

  const fetchData = async () => {
    try {
      const tasks = await pb
        .collection("tasks")
        .getFullList({ sort: "created" });
      setRecords(tasks);
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err);
    }
  };

  const handleRealtimeUpdate = (e) => {
    setRecords((prev) => {
      switch (e.action) {
        case "create":
          return [e.record, ...prev];
        case "update":
          return prev.map((item) =>
            item.id === e.record.id ? e.record : item
          );
        case "delete":
          return prev.filter((item) => item.id !== e.record.id);
        default:
          return prev;
      }
    });
  };

  const initRealtime = async () => {
    if (isConnecting.current) return;
    isConnecting.current = true;

    try {
      const socket = pb.realtime.client;

      if (!socket || socket.readyState !== 1) {
        await pb.realtime.disconnect();
        await pb.realtime.connect();
      }

      if (unsubscribeRef.current) {
        try {
          await unsubscribeRef.current();
        } catch (e) {
          console.warn("⚠️ Unsubscribe failed:", e);
        }
      }

      unsubscribeRef.current = await pb
        .collection("tasks")
        .subscribe("*", handleRealtimeUpdate);

      reconnectAttempts.current = 0;
    } catch (err) {
      console.error("❌ Realtime error:", err);

      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = BASE_RECONNECT_DELAY * 2 ** reconnectAttempts.current;
        reconnectAttempts.current++;
        setTimeout(initRealtime, delay);
      }
    } finally {
      isConnecting.current = false;
    }
  };

  useEffect(() => {
    fetchData();
    initRealtime();

    watchdogInterval.current = setInterval(() => {
      const socket = pb.realtime.client;
      if (!socket || socket.readyState !== 1) {
        initRealtime();
      }
    }, 15000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const socket = pb.realtime.client;
        if (!socket || socket.readyState !== 1) {
          initRealtime();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const authCleanup = pb.authStore.onChange(() => {
      if (!pb.authStore.isValid) {
        console.warn("🔐 Auth expired");
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {
          console.warn("⚠️ Unsubscribe cleanup error:", e);
        }
      }

      clearInterval(watchdogInterval.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      authCleanup();

      try {
        pb.realtime.disconnect();
      } catch (e) {
        console.warn("⚠️ Disconnect error:", e);
      }
    };
  }, []);

  return records;
}
