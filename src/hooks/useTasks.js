// src/hooks/useTasks.js
import { useEffect, useState } from "react";
import pb from "../Components/lib/pocketbase";

export default function useTasks() {
  const [records, setRecords] = useState([]);
  //   const pb = new PocketBase("https://hortiloader.pockethost.io");
  useEffect(() => {
    let unsubscribe;

    const fetchData = async () => {
      const records = await pb
        .collection("tasks")
        .getFullList({ sort: "created" });
      setRecords(records);
    };

    const handleRealtimeUpdate = async (e) => {
      if (e.action === "update") {
        try {
          const updated = await pb.collection("tasks").getOne(e.record.id);
          setRecords((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        } catch (err) {
          console.error("Failed to fetch updated record:", err);
        }
      } else if (e.action === "create") {
        setRecords((prev) => [e.record, ...prev]);
      } else if (e.action === "delete") {
        setRecords((prev) => prev.filter((item) => item.id !== e.record.id));
      }
    };

    const initRealtime = async () => {
      try {
        unsubscribe = await pb
          .collection("tasks")
          .subscribe("*", handleRealtimeUpdate);
      } catch (err) {
        console.error("Realtime subscription failed:", err);
      }
    };

    fetchData();
    initRealtime();

    return () => {
      if (unsubscribe) {
        unsubscribe(); // ✅ use stored unsubscribe function
      }
    };
  }, []);

  return records;
}
