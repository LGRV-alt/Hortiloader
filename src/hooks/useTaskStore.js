// import { create } from "zustand";
// import pb from "../Components/lib/pbConnect";

// export const useTaskStore = create((set, get) => ({
//   tasks: [],
//   loading: false,
//   pollingIntervalId: null,
//   fetchTasks: async () => {
//     set({ loading: true });
//     try {
//       const tasks = await pb
//         .collection("tasks")
//         .getFullList({ sort: "+created" });
//       set({ tasks });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   subscribeToTasks: async () => {
//     try {
//       await get().fetchTasks(); // Ensure tasks are loaded before subscribing
//       pb.collection("tasks").subscribe("*", (e) => {
//         const { action, record } = e;
//         set((state) => {
//           let tasks = state.tasks;
//           if (action === "create") {
//             tasks = [...tasks, record];
//           } else if (action === "update") {
//             tasks = tasks.map((t) => (t.id === record.id ? record : t));
//           } else if (action === "delete") {
//             tasks = tasks.filter((t) => t.id !== record.id);
//           }
//           return { tasks };
//         });
//       });
//     } catch (err) {
//       console.error("Realtime subscription failed. Starting polling fallback.");
//       get().startPolling(); // ✅ Automatically fallback to polling on failure
//     }
//   },

//   startPolling: () => {
//     if (get().pollingIntervalId) return; // Avoid duplicate polling
//     const intervalId = setInterval(() => {
//       get().fetchTasks();
//     }, 15000);
//     set({ pollingIntervalId: intervalId });
//   },

//   stopPolling: () => {
//     const intervalId = get().pollingIntervalId;
//     if (intervalId) {
//       clearInterval(intervalId);
//       set({ pollingIntervalId: null });
//     }
//   },

//   // ✅ OPTIMISTIC CREATE
//   createTask: async (data) => {
//     const tempId = crypto.randomUUID();
//     const optimisticTask = { ...data, id: tempId, _optimistic: true };
//     set((state) => ({ tasks: [...state.tasks, optimisticTask] }));

//     try {
//       const created = await pb.collection("tasks").create(data);
//       set((state) => ({
//         tasks: state.tasks.map((t) => (t.id === tempId ? created : t)),
//       }));
//     } catch (err) {
//       set((state) => ({
//         tasks: state.tasks.filter((t) => t.id !== tempId),
//       }));
//       throw err;
//     }
//   },

//   // ✅ OPTIMISTIC UPDATE
//   updateTask: async (id, data) => {
//     const prev = get().tasks.find((t) => t.id === id);
//     set((state) => ({
//       tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
//     }));

//     try {
//       const updated = await pb.collection("tasks").update(id, data);
//       set((state) => ({
//         tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
//       }));
//     } catch (err) {
//       // Optional: rollback logic
//       set((state) => ({
//         tasks: state.tasks.map((t) => (t.id === id ? prev : t)),
//       }));
//       throw err;
//     }
//   },

//   // ✅ OPTIMISTIC DELETE
//   deleteTask: async (id) => {
//     const prevTasks = get().tasks;
//     set((state) => ({
//       tasks: state.tasks.filter((t) => t.id !== id),
//     }));

//     try {
//       await pb.collection("tasks").delete(id);
//     } catch (err) {
//       set({ tasks: prevTasks });
//       throw err;
//     }
//   },
// }));

import { create } from "zustand";
import pb from "../Components/lib/pbConnect";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  pollingIntervalId: null,

  fetchTasks: async () => {
    const isInitialLoad = get().tasks.length === 0;
    if (isInitialLoad) set({ loading: true });

    try {
      const tasks = await pb
        .collection("tasks")
        .getFullList({ sort: "+created" });
      set({ tasks });
      if (isInitialLoad) {
        console.log("[PocketBase] Initial load complete.");
      }
    } finally {
      if (isInitialLoad) set({ loading: false });
    }
  },

  startPolling: () => {
    if (get().pollingIntervalId) return; // Prevent multiple intervals
    console.warn("[PocketBase] Polling started.");
    const intervalId = setInterval(() => {
      get().fetchTasks();
    }, 2 * 60 * 1000); // Every 15 seconds
    set({ pollingIntervalId: intervalId });
  },

  stopPolling: () => {
    const intervalId = get().pollingIntervalId;
    if (intervalId) {
      clearInterval(intervalId);
      set({ pollingIntervalId: null });
      console.warn("[PocketBase] Polling stopped.");
    }
  },

  startPollingWithImmediateFetch: () => {
    get().fetchTasks(); // Immediate fetch
    get().startPolling(); // Start polling after that
  },

  createTask: async (data) => {
    const tempId = crypto.randomUUID();
    const optimisticTask = { ...data, id: tempId, _optimistic: true };
    set((state) => ({ tasks: [...state.tasks, optimisticTask] }));

    try {
      const created = await pb.collection("tasks").create(data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === tempId ? created : t)),
      }));
    } catch (err) {
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== tempId),
      }));
      throw err;
    }
  },

  updateTask: async (id, data) => {
    const prev = get().tasks.find((t) => t.id === id);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));

    try {
      const updated = await pb.collection("tasks").update(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch (err) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? prev : t)),
      }));
      throw err;
    }
  },

  deleteTask: async (id) => {
    const prevTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    try {
      await pb.collection("tasks").delete(id);
    } catch (err) {
      set({ tasks: prevTasks });
      throw err;
    }
  },
}));
