// import { create } from "zustand";
// import pb from "../api/pbConnect";

// const buildFilter = ({ week, year } = {}) => {
//   const parts = ["deleted = false"];
//   if (Number.isInteger(week)) parts.push(`weekNumber = ${week}`);
//   if (Number.isInteger(year)) parts.push(`year = ${year}`);
//   return parts.join(" && ");
// };

// export const useTaskStore = create((set, get) => ({
//   tasks: [],
//   loading: false,
//   pollingIntervalId: null,
//   lastFetched: null,
//   // currentFetchId: null,

//   fetchTasks: async (params) => {
//     const isInitialLoad = get().tasks.length === 0;
//     console.log("fetch tasks called");

//     // const fetchId = crypto.randomUUID();
//     // set({ currentFetchId: fetchId, loading: true });
//     if (isInitialLoad) set({ loading: true });
//     try {
//       set({ loading: true });
//       const filter = buildFilter(params);
//       const tasks = await pb
//         .collection("tasks")
//         .getFullList({ filter, sort: "+created" });
//       // if (get().currentFetchId !== fetchId) return;
//       set({ tasks, lastFetched: new Date().toISOString(), loading: false });
//     } finally {
//       if (isInitialLoad) set({ loading: false });
//       // }  catch (err) {
//       //   if (get().currentFetchId === fetchId) set({ loading: false });
//       //   throw err;
//     }
//   },

//   startPolling: (ms = 5 * 60 * 1000, params) => {
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
//       set((state) => ({
//         tasks: state.tasks.map((t) => (t.id === id ? prev : t)),
//       }));
//       throw err;
//     }
//   },

//   deleteTask: async (id) => {
//     const prevTasks = get().tasks;
//     set((state) => ({
//       tasks: state.tasks.filter((t) => t.id !== id),
//     }));

//     try {
//       // Get the user at the moment you delete!
//       const user = pb.authStore?.record;
//       await pb.collection("tasks").update(id, {
//         deleted: true,
//         deleted_by: user?.id ?? null, // fallback if user is undefined
//         deleted_at: new Date().toISOString(),
//       });
//       // await pb.collection("tasks").delete(id);
//     } catch (err) {
//       set({ tasks: prevTasks });
//       throw err;
//     }
//   },
// }));

import { create } from "zustand";
import pb from "../api/pbConnect";

const buildFilter = ({ week, year } = {}) => {
  const parts = ["deleted = false"];
  if (Number.isInteger(week)) parts.push(`weekNumber = ${week}`);
  if (Number.isInteger(year)) parts.push(`year = ${year}`);
  return parts.join(" && ");
};

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  isFetching: false, // NEW: block overlapping fetches
  pollingIntervalId: null,
  _pollingConfig: undefined, // NEW: track current polling config to avoid dupes
  lastFetched: null,

  fetchTasks: async (params) => {
    if (get().isFetching) return;

    set({ loading: true, isFetching: true });
    try {
      const filter = buildFilter(params);
      const tasks = await pb
        .collection("tasks")
        .getFullList({ filter, sort: "+created" });

      set({
        tasks,
        lastFetched: new Date().toISOString(),
      });
    } catch (err) {
      console.error("fetchTasks failed:", err);
    } finally {
      set({ loading: false, isFetching: false });
    }
  },

  // startPolling can be called as:
  //   startPolling(params)
  //   startPolling(params, ms)
  //   startPolling(ms)
  //   startPolling(ms, params)
  startPolling: (arg1, arg2) => {
    let params;
    let ms;

    if (typeof arg1 === "number") {
      ms = arg1;
      params = arg2;
    } else {
      params = arg1;
      ms = typeof arg2 === "number" ? arg2 : undefined;
    }

    // Defaults & safety
    const DEFAULT_MS = 5 * 60 * 1000; // 5 minutes
    const SAFE_MIN_MS = 1000; // floor to avoid super-tight loops
    ms = Number.isFinite(ms) ? ms : DEFAULT_MS;
    if (ms < SAFE_MIN_MS) ms = DEFAULT_MS;

    const { pollingIntervalId, _pollingConfig } = get();
    const nextConfig = JSON.stringify({ ms, params });

    // If already polling with same cadence+params, do nothing
    if (pollingIntervalId && _pollingConfig === nextConfig) return;

    // If an interval exists but config changed, clear it
    if (pollingIntervalId) clearInterval(pollingIntervalId);

    const id = window.setInterval(() => {
      const state = get();
      if (state.isFetching) return; // guard against overlap
      state.fetchTasks(params);
    }, ms);

    set({ pollingIntervalId: id, _pollingConfig: nextConfig });
  },

  stopPolling: () => {
    const id = get().pollingIntervalId;
    if (id) {
      clearInterval(id);
      set({ pollingIntervalId: null, _pollingConfig: undefined });
    }
  },

  startPollingWithImmediateFetch: (params, ms) => {
    const state = get();
    if (!state.isFetching) {
      state.fetchTasks(params);
    }
    // Accept both orders here too
    get().startPolling(params, ms);
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
      const user = pb.authStore?.record;
      await pb.collection("tasks").update(id, {
        deleted: true,
        deleted_by: user?.id ?? null,
        deleted_at: new Date().toISOString(),
      });
    } catch (err) {
      set({ tasks: prevTasks });
      throw err;
    }
  },
}));
