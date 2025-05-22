// src/hooks/useTasks.js
import { useEffect, useState } from "react";
import PocketBase from "pocketbase";

export default function useTasks() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const pb = new PocketBase("https://hortiloader.pockethost.io");

    const fetchData = async () => {
      const records = await pb
        .collection("tasks")
        .getFullList({ sort: "created" });
      setRecords(records);
    };

    fetchData();

    // const handleRealtimeUpdate = (e) => {
    //   setRecords((prev) => {
    //     switch (e.action) {
    //       case "create":
    //         return [e.record, ...prev];
    //       case "update":
    //         return prev.map((item) =>
    //           item.id === e.record.id ? e.record : item
    //         );
    //       case "delete":
    //         return prev.filter((item) => item.id !== e.record.id);
    //       default:
    //         return prev;
    //     }
    //   });

    //   console.log(
    //     `%c[Realtime %c${e.action.toUpperCase()}%c] ID: ${e.record.id}`,
    //     "color: gray;",
    //     e.action === "create"
    //       ? "color: green;"
    //       : e.action === "update"
    //       ? "color: orange;"
    //       : "color: red;",
    //     "color: gray;"
    //   );
    // };
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
    let unsubscribe;

    const initRealtime = async () => {
      try {
        unsubscribe = await pb
          .collection("tasks")
          .subscribe("*", handleRealtimeUpdate);
      } catch (err) {
        console.error("Realtime subscription failed:", err);
      }
    };

    initRealtime();

    return () => {
      pb.collection("tasks").unsubscribe("*");
    };
  }, []);

  return records;
}
