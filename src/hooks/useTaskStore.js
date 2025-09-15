import { create } from "zustand";
import pb from "../api/pbConnect";

const buildFilter = ({ week, year } = {}) => {
  const parts = ["deleted = false"];
  if (Number.isInteger(week)) parts.push(`weekNumber = ${week}`);
  if (Number.isInteger(year)) parts.push(`year = ${year}`);
  return parts.join(" && ");
};

// export const useTaskStore = create((set, get) => ({
//   tasks: [],
//   loading: false,
//   pollingIntervalId: null,
//   lastFetched: null,
//   currentFetchId: null,

//   fetchTasks: async (params) => {
//     const isInitialLoad = get().tasks.length === 0;
//     console.log("fetch tasks called");

//     const fetchId = crypto.randomUUID();
//     set({ currentFetchId: fetchId, loading: true });
//     if (isInitialLoad) set({ loading: true });
//     try {
//       set({ loading: true });
//       const filter = buildFilter(params);
//       const tasks = await pb
//         .collection("tasks")
//         .getFullList({ filter, sort: "+created" });
//       if (get().currentFetchId !== fetchId) return;
//       set({ tasks, lastFetched: new Date().toISOString(), loading: false });
//     } catch (err) {
//       if (get().currentFetchId === fetchId) set({ loading: false });
//       throw err;
//     }
//   },

//   startPolling: (ms = 60 * 5 * 1000, params) => {
//     if (get().pollingIntervalId) return;
//     console.log("Polling check");

//     const intervalId = setInterval(() => {
//       const { lastFetched, fetchTasks } = get();
//       const now = Date.now();

//       // If never fetched, or it's older than `ms`, then fetch
//       if (!lastFetched || now - new Date(lastFetched).getTime() >= ms) {
//         fetchTasks(params);
//       }
//     }, 3000); // check every second (or every 30s to be lighter)

//     set({ pollingIntervalId: intervalId });
//   },

//   stopPolling: () => {
//     const id = get().pollingIntervalId;
//     if (id) {
//       clearInterval(id);
//       set({ pollingIntervalId: null });
//     }
//   },

//   startPollingWithImmediateFetch: (params) => {
//     get().fetchTasks(params); // Immediate fetch
//     get().startPolling(); // Start polling after that
//   },

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  pollingIntervalId: null,
  lastFetched: null,
  currentFetchId: null,
  // optional: track when a fetch started, to throttle by start time
  lastFetchStartedAt: null,

  fetchTasks: async (params) => {
    const fetchId = crypto.randomUUID();

    // mark fetch as started right away to block the poller
    const startedAtIso = new Date().toISOString();
    set({
      currentFetchId: fetchId,
      loading: true,
      lastFetchStartedAt: startedAtIso,
    });

    try {
      const filter = buildFilter(params);
      const tasks = await pb
        .collection("tasks")
        .getFullList({ filter, sort: "+created" });

      // only apply result if this is still the latest fetch
      if (get().currentFetchId !== fetchId) return;

      set({
        tasks,
        lastFetched: new Date().toISOString(),
        loading: false,
      });
    } catch (err) {
      // only clear loading if we're still the latest fetch
      if (get().currentFetchId === fetchId) {
        set({ loading: false });
      }
      throw err;
    }
  },

  startPolling: (ms = 60 * 10 * 1000, params) => {
    if (get().pollingIntervalId) return;
    console.log("Polling check");

    const intervalId = setInterval(() => {
      const { lastFetched, lastFetchStartedAt, loading, fetchTasks } = get();
      const now = Date.now();

      // avoid overlapping calls while a fetch is in-flight
      if (loading) return;

      // use whichever timestamp is newer: started or finished
      const lastTime = new Date(
        lastFetched ?? lastFetchStartedAt ?? 0
      ).getTime();

      // If never fetched (or started), or it's older than `ms`, then fetch
      if (!lastTime || now - lastTime >= ms) {
        fetchTasks(params);
      }
    }, 30000); // check every 3s (lighter than ms to reduce CPU)

    set({ pollingIntervalId: intervalId });
  },

  stopPolling: () => {
    const id = get().pollingIntervalId;
    if (id) {
      clearInterval(id);
      set({ pollingIntervalId: null });
    }
  },

  startPollingWithImmediateFetch: (params) => {
    // Immediate fetch; the poller will see loading=true and won't double-trigger
    get().fetchTasks(params);
    get().startPolling(undefined, params);
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
      // Get the user at the moment you delete!
      const user = pb.authStore?.record;
      await pb.collection("tasks").update(id, {
        deleted: true,
        deleted_by: user?.id ?? null, // fallback if user is undefined
        deleted_at: new Date().toISOString(),
      });
      // await pb.collection("tasks").delete(id);
    } catch (err) {
      set({ tasks: prevTasks });
      throw err;
    }
  },
}));
