import { create } from "zustand";
import pb from "../api/pbConnect";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  pollingIntervalId: null,
  lastFetched: null,

  fetchTasks: async () => {
    const isInitialLoad = get().tasks.length === 0;
    if (isInitialLoad) set({ loading: true });

    try {
      const tasks = await pb
        .collection("tasks")
        .getFullList({ sort: "+created" });
      set({ tasks, lastFetched: new Date().toISOString() });
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
