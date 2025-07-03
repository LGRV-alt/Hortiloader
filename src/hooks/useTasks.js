//------------------- Polling method ---------------

// import { useEffect, useRef, useState } from "react";
// import pb from "../Components/lib/pbConnect";
// import { onRefetchTasks } from "../Components/lib/eventBus";

// export default function useTasks() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true); // ✅ new loading state
//   const currentTasksRef = useRef([]);

//   useEffect(() => {
//     const stopListening = onRefetchTasks(() => {
//       console.log("Manual refetch triggered from event");
//       fetchTasks();
//     });
//     return () => stopListening();
//   }, []);

//   const fetchTasks = async () => {
//     if (!pb.authStore.isValid) return;

//     setLoading(true); // ✅ start loading

//     try {
//       const all = await pb.collection("tasks").getFullList({ sort: "created" });

//       const hasChanged =
//         all.length !== currentTasksRef.current.length ||
//         all.some(
//           (item, i) =>
//             item.id !== currentTasksRef.current[i]?.id ||
//             item.updated !== currentTasksRef.current[i]?.updated
//         );

//       if (hasChanged) {
//         setTasks(all);
//         currentTasksRef.current = all;
//         console.log("Tasks updated");
//       } else {
//         console.log("No task change detected");
//       }
//     } catch (err) {
//       console.error("Failed to fetch tasks:", err);
//     } finally {
//       setLoading(false); // ✅ end loading
//     }
//   };

//   useEffect(() => {
//     if (!pb.authStore.isValid) return;

//     fetchTasks(); // initial load

//     const interval = setInterval(fetchTasks, 300000); // poll every 60s

//     return () => clearInterval(interval);
//   }, [pb.authStore.isValid]);

//   return {
//     tasks,
//     refetch: fetchTasks,
//     loading, // ✅ expose loading state
//   };
// }

import { useEffect, useRef, useState } from "react";
import pb from "../Components/lib/pbConnect";
import { onRefetchTasks } from "../Components/lib/eventBus";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentTasksRef = useRef([]);
  const initialLoadRef = useRef(true);

  // holds the timer ID for our 2-minute tick
  const timerRef = useRef(null);

  // Manual refetch via your event bus
  useEffect(() => {
    const stop = onRefetchTasks(() => {
      console.log("Manual refetch triggered");
      fetchTasks();
    });
    return stop;
  }, []);

  // Actual fetch + change-detection
  const fetchTasks = async () => {
    if (!pb.authStore.isValid) return;

    // only show loading on first-ever fetch
    if (initialLoadRef.current) {
      setLoading(true);
    }

    try {
      const all = await pb.collection("tasks").getFullList({ sort: "created" });

      const hasChanged =
        all.length !== currentTasksRef.current.length ||
        all.some(
          (item, i) =>
            item.id !== currentTasksRef.current[i]?.id ||
            item.updated !== currentTasksRef.current[i]?.updated
        );

      if (hasChanged) {
        setTasks(all);
        currentTasksRef.current = all;
        console.log("Tasks updated");
      } else {
        console.log("No task change detected");
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      // end loading after first fetch
      if (initialLoadRef.current) {
        setLoading(false);
        initialLoadRef.current = false;
      }
      // schedule the next automatic fetch in 2 minutes
      resetTimer();
    }
  };

  // Clears any existing timer and sets a new one for 2 minutes out
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fetchTasks, 2 * 60 * 1000);
  };

  // Kick things off on mount (and whenever auth changes)
  useEffect(() => {
    if (!pb.authStore.isValid) return;

    fetchTasks(); // this will also schedule the first 2-min timeout

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pb.authStore.isValid]);

  return { tasks, refetch: fetchTasks, loading };
}

// import { useEffect, useState } from "react";
// import pb from "../Components/lib/pbConnect"; // your existing PocketBase instance
// import useAuth from "./useAuth";

// export default function useTasks() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const isAuthenticated = useAuth();

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const result = await pb.collection("tasks").getFullList({
//         sort: "+created",
//       });
//       setTasks(result);
//     } catch (err) {
//       console.error("Failed to fetch tasks:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!isAuthenticated) return;

//     let unsubscribeFunc;

//     const setupSubscription = async () => {
//       await fetchTasks(); // Ensure tasks are fetched before subscribing

//       try {
//         unsubscribeFunc = await pb.collection("tasks").subscribe("*", (e) => {
//           console.log("Realtime task update:", e);

//           setTasks((prev) => {
//             const { action, record } = e;

//             if (action === "create") {
//               return [...prev, record]; // add to end
//             }

//             if (action === "update") {
//               return prev.map((item) =>
//                 item.id === record.id ? record : item
//               );
//             }

//             if (action === "delete") {
//               return prev.filter((item) => item.id !== record.id);
//             }

//             return prev;
//           });
//         });
//       } catch (err) {
//         console.error("Failed to subscribe to tasks:", err);
//       }
//     };

//     setupSubscription();

//     return () => {
//       if (unsubscribeFunc) {
//         unsubscribeFunc(); // Clean up properly
//       }
//     };
//   }, [isAuthenticated]);

//   return {
//     tasks,
//     refetch: fetchTasks,
//     loading,
//   };
// }
