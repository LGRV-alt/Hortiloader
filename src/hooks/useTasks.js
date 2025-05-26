import { useState, useEffect, useRef } from "react";
import pb from "../Components/lib/pbConnect";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const unsubscribeRef = useRef(null);
  const isSubscribingRef = useRef(false);

  useEffect(() => {
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

    const subscribeTasks = async () => {
      if (isSubscribingRef.current) return;
      isSubscribingRef.current = true;
      try {
        if (typeof unsubscribeRef.current === "function") {
          unsubscribeRef.current();
        }
        unsubscribeRef.current = await pb
          .collection("tasks")
          .subscribe("*", applyEvent);
        console.log("✅ Subscribed to tasks realtime");
      } catch (err) {
        console.error("❌ subscribeTasks() failed:", err);
      } finally {
        isSubscribingRef.current = false;
      }
    };

    (async () => {
      try {
        // (optional) auth-refresh
        if (!pb.authStore.isValid) {
          await pb.collection("users").authRefresh();
        }

        // initial fetch
        const list = await pb
          .collection("tasks")
          .getFullList({ sort: "created" });
        setTasks(list);

        // first subscription
        await subscribeTasks();

        // re-subscribe on disconnect
        pb.realtime.onDisconnect = () => {
          console.warn("⚠️ SSE disconnected, re-subscribing…");
          subscribeTasks();
        };
      } catch (err) {
        console.error("❌ useTasks init error:", err);
      }
    })();

    return () => {
      if (typeof unsubscribeRef.current === "function") {
        unsubscribeRef.current();
      }
      pb.realtime.onDisconnect = null;
    };
  }, []);

  return tasks;
}
