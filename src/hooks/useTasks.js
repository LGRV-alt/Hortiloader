import { useEffect, useRef, useState } from "react";
import pb from "../Components/lib/pbConnect";

export default function useTasks() {
  const [records, setRecords] = useState([]);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const handleRealtimeUpdate = (e) => {
      console.log("📡 Realtime event:", e);
      setRecords((prev) => {
        switch (e.action) {
          case "create":
            return [e.record, ...prev];
          case "update":
            return prev.map((r) => (r.id === e.record.id ? e.record : r));
          case "delete":
            return prev.filter((r) => r.id !== e.record.id);
          default:
            return prev;
        }
      });
    };

    const init = async () => {
      try {
        // ensure auth
        if (!pb.authStore.isValid) {
          await pb.collection("users").authRefresh();
        }

        // initial fetch
        const tasks = await pb
          .collection("tasks")
          .getFullList({ sort: "created" });
        if (isMounted) setRecords(tasks);

        // clean up any prior subscription
        if (unsubscribeRef.current) {
          try {
            unsubscribeRef.current();
          } catch (e) {
            console.warn("⚠️ Unsubscribe error:", e);
          }
        }

        // subscribe—SDK handles connection & client ID
        const unsub = await pb
          .collection("tasks")
          .subscribe("*", handleRealtimeUpdate);
        unsubscribeRef.current = unsub;
      } catch (err) {
        console.error("❌ Realtime subscription failed:", err);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {
          console.warn("⚠️ Unsubscribe error:", e);
        }
      }
    };
  }, []);

  return records;
}
