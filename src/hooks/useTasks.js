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

    // const handleRealtimeUpdate = async (e) => {
    //   console.log(e.action);
    //   if (e.action === "update") {
    //     try {
    //       const updated = await pb.collection("tasks").getOne(e.record.id);
    //       setRecords((prev) =>
    //         prev.map((item) => (item.id === updated.id ? updated : item))
    //       );
    //     } catch (err) {
    //       console.error("Failed to fetch updated record:", err);
    //     }
    //   } else if (e.action === "create") {
    //     setRecords((prev) => [e.record, ...prev]);
    //   } else if (e.action === "delete") {
    //     setRecords((prev) => prev.filter((item) => item.id !== e.record.id));
    //   }
    // };

    const handleRealtimeUpdate = async (e) => {
      console.log("Realtime event:", e);

      if (e.action === "create") {
        setRecords((prev) => [e.record, ...prev]);
      } else if (e.action === "update") {
        setRecords((prev) =>
          prev.map((item) => (item.id === e.record.id ? e.record : item))
        );
      } else if (e.action === "delete") {
        setRecords((prev) => prev.filter((item) => item.id !== e.record.id));
      }
    };

    // const initRealtime = async () => {
    //   try {
    //     unsubscribe = await pb
    //       .collection("tasks")
    //       .subscribe("*", handleRealtimeUpdate);
    //   } catch (err) {
    //     console.error("Realtime subscription failed:", err);
    //   }
    // };

    // const initRealtime = async () => {
    //   try {
    //     // First, wait for realtime to fully connect
    //     await pb.realtime.subscribe("PB_CONNECT", async (e) => {
    //       console.log("Realtime connected, clientId:", e.clientId);

    //       // Now that it's connected, subscribe to your collection
    //       unsubscribe = await pb
    //         .collection("tasks")
    //         .subscribe("*", handleRealtimeUpdate);

    //       console.log("Subscribed to tasks collection.");
    //     });
    //   } catch (err) {
    //     console.error("Realtime subscription failed:", err);
    //   }
    // };

    const initRealtime = async () => {
      try {
        // On connect
        await pb.realtime.subscribe("PB_CONNECT", async (e) => {
          console.log("📡 Connected to realtime:", e.clientId);

          unsubscribe = await pb
            .collection("tasks")
            .subscribe("*", handleRealtimeUpdate);

          console.log("✅ Subscribed to 'tasks' collection");
        });

        // On disconnect
        await pb.realtime.subscribe("PB_DISCONNECT", async () => {
          console.warn("⚠️ Disconnected from realtime");

          // Try reconnecting after a short delay
          setTimeout(() => {
            console.log("🔁 Attempting to reconnect...");
            initRealtime(); // Recursively re-initialize
          }, 3000); // 3-second delay before retry
        });
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
