// import { create } from "zustand";
// import pb from "../Components/lib/pbConnect";

// export const useTaskStore = create((set, get) => ({
//   tasks: [],
//   loading: false,
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
//     await get().fetchTasks();
//     pb.collection("tasks").subscribe("*", (e) => {
//       const { action, record } = e;
//       set((state) => {
//         let tasks = state.tasks;
//         if (action === "create") {
//           tasks = [...tasks, record];
//         } else if (action === "update") {
//           tasks = tasks.map((t) => (t.id === record.id ? record : t));
//         } else if (action === "delete") {
//           tasks = tasks.filter((t) => t.id !== record.id);
//         }
//         return { tasks };
//       });
//     });
//   },
// }));

import { create } from "zustand";
import pb from "../Components/lib/pbConnect";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await pb
        .collection("tasks")
        .getFullList({ sort: "+created" });
      set({ tasks });
    } finally {
      set({ loading: false });
    }
  },
  subscribeToTasks: async () => {
    await get().fetchTasks();
    pb.collection("tasks").subscribe("*", (e) => {
      const { action, record } = e;
      set((state) => {
        let tasks = state.tasks;
        if (action === "create") {
          tasks = [...tasks, record];
        } else if (action === "update") {
          tasks = tasks.map((t) => (t.id === record.id ? record : t));
        } else if (action === "delete") {
          tasks = tasks.filter((t) => t.id !== record.id);
        }
        return { tasks };
      });
    });
  },

  // ✅ POLLING
  startPolling: () => {
    const intervalId = setInterval(() => {
      get().fetchTasks();
    }, 15000); // Every 15 seconds (adjust if needed)
    set({ pollingIntervalId: intervalId });
  },

  stopPolling: () => {
    const intervalId = get().pollingIntervalId;
    if (intervalId) clearInterval(intervalId);
  },

  // ✅ OPTIMISTIC CREATE
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

  // ✅ OPTIMISTIC UPDATE
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
      // Optional: rollback logic
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? prev : t)),
      }));
      throw err;
    }
  },

  // ✅ OPTIMISTIC DELETE
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
