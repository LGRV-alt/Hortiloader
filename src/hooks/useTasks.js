// -------------------------NOT USING REALTIME-----------------------------

// import { useEffect, useState } from "react";
// import pb from "../Components/lib/pbConnect";

// export default function useTasks() {
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     let intervalId;

//     const fetchTasks = async () => {
//       if (!pb.authStore.isValid) return;
//       const records = await pb
//         .collection("tasks")
//         .getFullList({ sort: "-created" });
//       setTasks(records);
//     };

//     fetchTasks(); // initial load

//     intervalId = setInterval(fetchTasks, 10000); // every 10 seconds

//     return () => clearInterval(intervalId);
//   }, []);

//   return tasks;
// }

// --------------------------REALTIME--------------------------------
import { useEffect, useState } from "react";
import pb from "../Components/lib/pbConnect";

export default function useTasks() {
  console.log(pb.realtime.clientId);
  console.log(pb.authStore);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // don’t do anything until we’re authenticated
    if (!pb.authStore.isValid) return;

    let unsubscribe;

    // helper to update tasks based on action
    const handleRealtime = ({ action, record }) => {
      setTasks((prev) => {
        if (action === "create") return [record, ...prev];
        if (action === "update")
          return prev.map((t) => (t.id === record.id ? record : t));
        if (action === "delete") return prev.filter((t) => t.id !== record.id);
        return prev;
      });
    };

    // fetch once and subscribe
    (async () => {
      const all = await pb
        .collection("tasks")
        .getFullList({ sort: "-created" });
      setTasks(all);
      unsubscribe = await pb.collection("tasks").subscribe("*", handleRealtime);
    })();

    return () => {
      unsubscribe?.();
    };
  }, [pb.authStore.isValid]);

  return tasks;
}

// hooks/useTasks.js
// import { useEffect, useState, useRef } from "react";
// import pb from "../Components/lib/pbConnect";

// export default function useTasks() {
//   const [tasks, setTasks] = useState([]);
//   const lastClientId = useRef(null);
//   const unsubscribeTasksRef = useRef(null);
//   const unsubscribeConnectRef = useRef(null);

//   const POLL_INTERVAL_MS = 60 * 1000; // 1m
//   const pollerRef = useRef(null);

//   // 1) Full reload helper
//   const reload = async () => {
//     console.log("[useTasks][reload] fetching all tasks…");
//     try {
//       const all = await pb
//         .collection("tasks")
//         .getFullList({ sort: "-created" });
//       console.log(`[useTasks][reload] fetched ${all.length} tasks`);
//       setTasks(all);
//     } catch (err) {
//       console.error("[useTasks][reload] error:", err);
//     }
//   };

//   // 2) Handle individual realtime events
//   const handleRealtime = ({ action, record }) => {
//     console.log(`[useTasks][realtime] ${action}`, record);
//     setTasks((prev) => {
//       if (action === "create") return [record, ...prev];
//       if (action === "update")
//         return prev.map((t) => (t.id === record.id ? record : t));
//       if (action === "delete") return prev.filter((t) => t.id !== record.id);
//       return prev;
//     });
//   };

//   // 3) On connect / reconnect via PB_CONNECT
//   const handleConnect = ({ clientId }) => {
//     console.log(
//       `[useTasks][PB_CONNECT] new clientId=${clientId}; last=${lastClientId.current}`
//     );
//     console.log(
//       "[useTasks][PB_CONNECT] reconnectAttempts:",
//       pb.realtime.reconnectAttempts
//     );
//     if (lastClientId.current && lastClientId.current !== clientId) {
//       console.warn("[useTasks][PB_CONNECT] detected reconnect, reloading");
//       reload();
//     }
//     lastClientId.current = clientId;
//   };

//   useEffect(() => {
//     console.log("[useTasks][effect] auth valid?", pb.authStore.isValid);
//     if (!pb.authStore.isValid) return;

//     // ——— Instrument raw EventSource ———
//     const es = pb.realtime.eventSource;
//     if (es) {
//       console.log("[useTasks] instrumenting EventSource", es);
//       es.onopen = () =>
//         console.log(
//           "[useTasks][EventSource] onopen (readyState=",
//           es.readyState,
//           ") clientId=",
//           pb.realtime.clientId
//         );
//       es.onerror = (err) => {
//         console.error(
//           "[useTasks][EventSource] onerror (readyState=",
//           es.readyState,
//           ")",
//           err
//         );
//         // force a full reconnect via SDK:
//         unsubscribeConnectRef.current?.();
//         unsubscribeConnectRef.current = null;
//         pb.realtime.subscribe("PB_CONNECT", handleConnect).then((unsub) => {
//           unsubscribeConnectRef.current = unsub;
//           console.log("[useTasks] re-subscribed PB_CONNECT after error");
//         });
//       };
//     }

//     // ——— Initial load + task subscription ———
//     (async () => {
//       await reload();
//       console.log("[useTasks] subscribing to tasks/*");
//       unsubscribeTasksRef.current = await pb
//         .collection("tasks")
//         .subscribe("*", handleRealtime);
//     })();

//     // ——— PB_CONNECT guard + subscribe ———
//     const existing = pb.realtime.subscriptions["PB_CONNECT"]?.length ?? 0;
//     console.log("[useTasks] PB_CONNECT handlers:", existing);
//     if (!existing) {
//       console.log("[useTasks] subscribing to PB_CONNECT");
//       pb.realtime.subscribe("PB_CONNECT", handleConnect).then((unsub) => {
//         unsubscribeConnectRef.current = unsub;
//         console.log("[useTasks] PB_CONNECT unsubscribe ready");
//       });
//     } else {
//       console.log("[useTasks] skip PB_CONNECT (already subscribed)");
//     }

//     // ——— Polling fallback ———
//     pollerRef.current = setInterval(() => {
//       console.log("[useTasks][poll] fetching tasks…");
//       reload();
//     }, POLL_INTERVAL_MS);

//     // ——— Cleanup ———
//     return () => {
//       console.log("[useTasks][cleanup] unsubscribing everything");
//       unsubscribeTasksRef.current?.();
//       unsubscribeConnectRef.current?.();
//       clearInterval(pollerRef.current);
//     };
//   }, [pb.authStore.isValid]);

//   return tasks;
// }
