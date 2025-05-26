// src/hooks/useTasks.js
import { useState, useEffect } from "react";
import pb from "../Components/lib/pbConnect";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let unsubscribe;

    // apply a realtime event to local state
    const applyEvent = (e) => {
      setTasks((prev) => {
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
    };

    // fetch + subscribe
    (async () => {
      try {
        // (Optional) refresh auth if your collection is protected
        if (!pb.authStore.isValid) {
          await pb.collection("users").authRefresh();
        }

        // 1) initial fetch
        const list = await pb
          .collection("tasks")
          .getFullList({ sort: "created" });
        setTasks(list);

        // 2) subscribe — under the hood this does:
        //    GET  /api/realtime        ← SSE connect
        //    POST /api/realtime        ← register subscriptions
        unsubscribe = await pb.collection("tasks").subscribe("*", applyEvent);
      } catch (err) {
        console.error("useTasks init error:", err);
      }
    })();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return tasks;
}
