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

import { useEffect, useState } from "react";
import pb from "../Components/lib/pbConnect"; // your existing PocketBase instance

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const result = await pb.collection("tasks").getFullList({
        sort: "-created",
      });
      setTasks(result);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Subscribe to changes in the 'tasks' collection
    const unsubscribe = pb.collection("tasks").subscribe("*", (e) => {
      console.log("Realtime task update:", e);

      setTasks((prev) => {
        const { action, record } = e;

        if (action === "create") {
          return [record, ...prev];
        }

        if (action === "update") {
          return prev.map((item) => (item.id === record.id ? record : item));
        }

        if (action === "delete") {
          return prev.filter((item) => item.id !== record.id);
        }

        return prev;
      });
    });

    return () => {
      unsubscribe(); // clean up on unmount
    };
  }, []);

  return {
    tasks,
    refetch: fetchTasks,
    loading,
  };
}
