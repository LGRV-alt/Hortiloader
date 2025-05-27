// V1

// import { useState, useEffect, useRef } from "react";
// import pb from "../Components/lib/pbConnect";

// export default function useTasks() {
//   const [tasks, setTasks] = useState([]);
//   const unsubscribeRef = useRef(null);
//   const isSubscribingRef = useRef(false);

//   useEffect(() => {
//     const applyEvent = (e) => {
//       console.log("📦 Realtime event:", e); // <-- add this line

//       setTasks((prev) => {
//         switch (e.action) {
//           case "create":
//             return [...prev, e.record].sort(
//               (a, b) => new Date(a.created) - new Date(b.created)
//             );
//           case "update":
//             return prev.map((t) => (t.id === e.record.id ? e.record : t));
//           case "delete":
//             return prev.filter((t) => t.id !== e.record.id);
//           default:
//             return prev;
//         }
//       });
//     };

//     const subscribeTasks = async () => {
//       if (isSubscribingRef.current) return;
//       isSubscribingRef.current = true;
//       try {
//         if (typeof unsubscribeRef.current === "function") {
//           unsubscribeRef.current();
//         }
//         unsubscribeRef.current = await pb
//           .collection("tasks")
//           .subscribe("*", applyEvent);
//         console.log("✅ Subscribed to tasks realtime");
//       } catch (err) {
//         console.error("❌ subscribeTasks() failed:", err);
//       } finally {
//         isSubscribingRef.current = false;
//       }
//     };

//     (async () => {
//       try {
//         // (optional) auth-refresh
//         if (!pb.authStore.isValid) {
//           await pb.collection("users").authRefresh();
//         }

//         // initial fetch
//         const list = await pb
//           .collection("tasks")
//           .getFullList({ sort: "created" });
//         setTasks(list);

//         // first subscription
//         await subscribeTasks();

//         // re-subscribe on disconnect
//         pb.realtime.onDisconnect = () => {
//           console.warn("⚠️ SSE disconnected, re-subscribing…");
//           subscribeTasks();
//         };
//       } catch (err) {
//         console.error("❌ useTasks init error:", err);
//       }
//     })();

//     return () => {
//       if (typeof unsubscribeRef.current === "function") {
//         unsubscribeRef.current();
//       }
//       pb.realtime.onDisconnect = null;
//     };
//   }, []);

//   return tasks;
// }

// src/hooks/useTasks.js
import { useState, useEffect, useRef } from "react";
import pb from "../Components/lib/pbConnect";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  // const unsubRef = useRef(null);

  //   useEffect(() => {
  //     // Handler for realtime events
  //     const handleEvent = (e) => {
  //       setTasks((prev) => {
  //         switch (e.action) {
  //           case "create":
  //             return [...prev, e.record];
  //           case "update":
  //             return prev.map((t) => (t.id === e.record.id ? e.record : t));
  //           case "delete":
  //             return prev.filter((t) => t.id !== e.record.id);
  //           default:
  //             return prev;
  //         }
  //       });
  //     };

  //     // Initial fetch
  //     pb.collection("tasks").getFullList({ sort: "created" }).then(setTasks);

  //     // Subscribe to realtime events (create/update/delete)
  //     pb.collection("tasks")
  //       .subscribe("*", handleEvent)
  //       .then((unsub) => {
  //         unsubRef.current = unsub;
  //       });

  //     // Cleanup on unmount
  //     return () => {
  //       if (typeof unsubRef.current === "function") unsubRef.current();
  //     };
  //   }, []);

  //   return tasks;
  // }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const records = await pb.collection("tasks").getFullList({
          sort: "-created",
        });
        setTasks(records);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();

    const handleChange = (e) => {
      setTasks((prevTasks) => {
        switch (e.action) {
          case "create":
            return [e.record, ...prevTasks];
          case "update":
            return prevTasks.map((task) =>
              task.id === e.record.id ? e.record : task
            );
          case "delete":
            return prevTasks.filter((task) => task.id !== e.record.id);
          default:
            return prevTasks;
        }
      });
    };

    pb.collection("tasks").subscribe("*", handleChange);

    return () => {
      pb.collection("tasks").unsubscribe("*");
    };
  }, []);

  return tasks;
}
