// src/hooks/useTasks.js
import { useState, useEffect } from "react";
import pb from "../Components/lib/pbConnect";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      try {
        // (Optional) refresh auth if needed
        if (!pb.authStore.isValid) {
          await pb.collection("users").authRefresh();
        }

        // 1) initial fetch
        const list = await pb
          .collection("tasks")
          .getFullList({ sort: "created" });
        setTasks(list);

        // 2) subscribe to all create/update/delete events
        unsubscribe = await pb.collection("tasks").subscribe("*", (event) => {
          setTasks((prev) => {
            switch (event.action) {
              case "create":
                return [event.record, ...prev];
              case "update":
                return prev.map((t) =>
                  t.id === event.record.id ? event.record : t
                );
              case "delete":
                return prev.filter((t) => t.id !== event.record.id);
              default:
                return prev;
            }
          });
        });
      } catch (err) {
        console.error("useTasks init error:", err);
      }
    };

    init();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return tasks;
}
