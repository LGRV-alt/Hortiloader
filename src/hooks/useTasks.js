import { useEffect, useRef, useState } from "react";
import pb from "../Components/lib/pbConnect";
import { onRefetchTasks } from "../Components/lib/eventBus";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ new loading state
  const currentTasksRef = useRef([]);

  useEffect(() => {
    const stopListening = onRefetchTasks(() => {
      console.log("Manual refetch triggered from event");
      fetchTasks();
    });
    return () => stopListening();
  }, []);

  const fetchTasks = async () => {
    if (!pb.authStore.isValid) return;

    setLoading(true); // ✅ start loading

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
      setLoading(false); // ✅ end loading
    }
  };

  useEffect(() => {
    if (!pb.authStore.isValid) return;

    fetchTasks(); // initial load

    const interval = setInterval(fetchTasks, 300000); // poll every 60s

    return () => clearInterval(interval);
  }, [pb.authStore.isValid]);

  return {
    tasks,
    refetch: fetchTasks,
    loading, // ✅ expose loading state
  };
}
