// import { useEffect, useState } from "react";
// import pb from "../Components/lib/pbConnect";

// export default function useTasks() {
//   const [records, setRecords] = useState([]);
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   useEffect(() => {
//     let unsubscribe;
//     let watchdogInterval;

//     const fetchData = async () => {
//       const records = await pb
//         .collection("tasks")
//         .getFullList({ sort: "created" });
//       setRecords(records);
//     };

//     const handleRealtimeUpdate = (e) => {
//       console.log("Realtime event:", e);

//       if (e.action === "create") {
//         setRecords((prev) => [e.record, ...prev]);
//       } else if (e.action === "update") {
//         setRecords((prev) =>
//           prev.map((item) => (item.id === e.record.id ? e.record : item))
//         );
//       } else if (e.action === "delete") {
//         setRecords((prev) => prev.filter((item) => item.id !== e.record.id));
//       }
//     };

//     const initRealtime = async () => {
//       try {
//         // Clean up existing subscription first
//         if (unsubscribe) await unsubscribe();

//         unsubscribe = await pb
//           .collection("tasks")
//           .subscribe("*", handleRealtimeUpdate);
//         console.log("✅ Subscribed to 'tasks' collection");
//         setIsSubscribed(true);
//       } catch (err) {
//         console.error("Realtime subscription failed:", err);
//         setIsSubscribed(false);
//       }
//     };

//     fetchData();
//     initRealtime();

//     watchdogInterval = setInterval(() => {
//       const socket = pb.realtime.client;
//       if (!socket || socket.readyState !== 1) {
//         console.warn("🔌 WebSocket not open. Reinitializing...");
//         initRealtime();
//       }
//     }, 60000); // Every 10 seconds

//     // Optional: monitor PocketBase's connect/disconnect events
//     pb.realtime.subscribe("PB_CONNECT", (e) => {
//       console.log("📡 Connected to realtime:", e.clientId);
//     });

//     pb.realtime.subscribe("PB_DISCONNECT", () => {
//       console.warn("⚠️ Disconnected from realtime");
//       setIsSubscribed(false);
//     });

//     return () => {
//       if (unsubscribe) unsubscribe();
//       if (watchdogInterval) clearInterval(watchdogInterval);
//     };
//   }, []);

//   return records;
// }
import { useEffect, useState } from "react";
import pb from "../Components/lib/pbConnect";

export default function useTasks() {
  const [records, setRecords] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let unsubscribe;
    let watchdogInterval;
    let isConnecting = false;

    const fetchData = async () => {
      try {
        const records = await pb
          .collection("tasks")
          .getFullList({ sort: "created" });
        setRecords(records);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    const handleRealtimeUpdate = (e) => {
      console.log("📡 Realtime event:", e);

      if (e.action === "create") {
        setRecords((prev) => [e.record, ...prev]);
      } else if (e.action === "update") {
        setRecords((prev) =>
          prev.map((item) => (item.id === e.record.id ? e.record : item))
        );
      } else if (e.action === "delete") {
        setRecords((prev) => prev.filter((item) => item.id !== e.record.id));
      }
    };

    const initRealtime = async () => {
      if (isConnecting) return;
      isConnecting = true;

      try {
        if (unsubscribe) await unsubscribe(); // Clean up any existing sub
        unsubscribe = await pb
          .collection("tasks")
          .subscribe("*", handleRealtimeUpdate);

        console.log("✅ Subscribed to 'tasks' collection");
        setIsSubscribed(true);
      } catch (err) {
        console.error("❌ Failed to subscribe to tasks:", err);
        setIsSubscribed(false);
      } finally {
        isConnecting = false;
      }
    };

    // Monitor visibility to restore dropped socket if needed
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const socket = pb.realtime.client;
        if (!socket || socket.readyState !== 1) {
          console.warn("🔄 Page visible but socket closed. Reconnecting...");
          initRealtime();
        }
      }
    };

    // Setup PB realtime connect/disconnect events
    const handleConnect = (e) => {
      console.log("🟢 Realtime connected:", e.clientId);
    };
    const handleDisconnect = () => {
      console.warn("🔴 Realtime disconnected");
      setIsSubscribed(false);
    };

    fetchData();
    initRealtime();

    // Watchdog to check every 10s
    watchdogInterval = setInterval(() => {
      const socket = pb.realtime.client;
      if (!socket || socket.readyState !== 1) {
        console.warn("🔌 Socket not open. Attempting to reconnect...");
        initRealtime();
      }
    }, 60000);

    // Add visibility watcher
    document.addEventListener("visibilitychange", handleVisibility);

    // Add PB event listeners
    pb.realtime.subscribe("PB_CONNECT", handleConnect);
    pb.realtime.subscribe("PB_DISCONNECT", handleDisconnect);

    // Cleanup
    return () => {
      if (unsubscribe) unsubscribe();
      if (watchdogInterval) clearInterval(watchdogInterval);
      document.removeEventListener("visibilitychange", handleVisibility);
      pb.realtime.unsubscribe("PB_CONNECT", handleConnect);
      pb.realtime.unsubscribe("PB_DISCONNECT", handleDisconnect);
    };
  }, []);

  return records;
}
