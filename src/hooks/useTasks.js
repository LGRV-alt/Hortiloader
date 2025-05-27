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
