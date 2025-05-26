// import { useEffect, useRef, useState } from "react";
// import pb from "../Components/lib/pbConnect";

// export default function useTasks() {
//   const [records, setRecords] = useState([]);

//   const unsubscribeRef = useRef(null);
//   const isConnecting = useRef(false);
//   const reconnectAttempts = useRef(0);
//   const watchdogInterval = useRef(null);

//   const MAX_RECONNECT_ATTEMPTS = 5;
//   const BASE_RECONNECT_DELAY = 1000;

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
//     setRecords((prev) => {
//       switch (e.action) {
//         case "create":
//           return [e.record, ...prev];
//         case "update":
//           return prev.map((item) =>
//             item.id === e.record.id ? e.record : item
//           );
//         case "delete":
//           return prev.filter((item) => item.id !== e.record.id);
//         default:
//           return prev;
//       }
//     });
//   };

//   const initRealtime = async () => {
//     if (isConnecting.current) return;
//     isConnecting.current = true;

//     try {
//       const socket = pb.realtime.client;

//       if (!socket || socket.readyState !== 1) {
//         await pb.realtime.disconnect();
//         await pb.realtime.connect();
//       }

//       if (unsubscribeRef.current) {
//         try {
//           await unsubscribeRef.current();
//         } catch (e) {
//           console.warn("⚠️ Unsubscribe failed:", e);
//         }
//       }

//       unsubscribeRef.current = await pb
//         .collection("tasks")
//         .subscribe("*", handleRealtimeUpdate);

//       reconnectAttempts.current = 0;
//     } catch (err) {
//       console.error("❌ Realtime error:", err);

//       if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
//         const delay = BASE_RECONNECT_DELAY * 2 ** reconnectAttempts.current;
//         reconnectAttempts.current++;
//         setTimeout(initRealtime, delay);
//       }
//     } finally {
//       isConnecting.current = false;
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     initRealtime();

//     watchdogInterval.current = setInterval(() => {
//       const socket = pb.realtime.client;
//       if (!socket || socket.readyState !== 1) {
//         initRealtime();
//       }
//     }, 15000);

//     const handleVisibility = () => {
//       if (document.visibilityState === "visible") {
//         const socket = pb.realtime.client;
//         if (!socket || socket.readyState !== 1) {
//           initRealtime();
//         }
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibility);

//     const authCleanup = pb.authStore.onChange(() => {
//       if (!pb.authStore.isValid) {
//         console.warn("🔐 Auth expired");
//       }
//     });

//     return () => {
//       if (unsubscribeRef.current) {
//         try {
//           unsubscribeRef.current();
//         } catch (e) {
//           console.warn("⚠️ Unsubscribe cleanup error:", e);
//         }
//       }

//       clearInterval(watchdogInterval.current);
//       document.removeEventListener("visibilitychange", handleVisibility);
//       authCleanup();

//       try {
//         pb.realtime.disconnect();
//       } catch (e) {
//         console.warn("⚠️ Disconnect error:", e);
//       }
//     };
//   }, []);

//   return records;
// }

import { useEffect, useRef, useState } from "react";
import pb from "../Components/lib/pbConnect";
import subscribeWithReconnect from "../Components/lib/subscribeWithReconnect";

export default function useTasks() {
  const [records, setRecords] = useState([]);
  const unsubscribeRef = useRef(null);

  const fetchData = async () => {
    const tasks = await pb.collection("tasks").getFullList({ sort: "created" });
    setRecords(tasks);
  };

  useEffect(() => {
    console.log("Mounted");
    const handleRealtime = (e) => {
      try {
        console.log("📡 Got realtime update:", e);
        setRecords((prev) => {
          switch (e.action) {
            case "create":
              return [e.record, ...prev];
            case "update":
              return prev.map((t) => (t.id === e.record.id ? e.record : t));
            case "delete":
              return prev.filter((t) => t.id !== e.record.id);
            default:
              return prev;
          }
        });
      } catch (err) {
        console.error("❌ Error processing update:", err);
      }
    };

    fetchData();

    subscribeWithReconnect(pb, "tasks", "*", handleRealtime)
      .then((unsubscribe) => {
        unsubscribeRef.current = unsubscribe;
      })
      .catch((err) => {
        console.error("❌ Failed to establish realtime subscription:", err);
      });

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

  return records;
}
