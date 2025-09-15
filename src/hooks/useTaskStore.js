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

const paramsKey = (p = {}) =>
  `${Number.isInteger(p.week) ? p.week : "any"}-${
    Number.isInteger(p.year) ? p.year : "any"
  }`;

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  inFlight: false,
  pollingIntervalId: null,
  pollingMs: 5 * 60 * 1000, // 5 minutes
  lastFetched: null, // number (epoch ms) is easier for comparisons
  currentParamsKey: null, // tracks the params used for the last fetch
  currentFetchId: null,

  // fetchTasks: async (params) => {
  //   const key = paramsKey(params);
  //   const state = get();
  //   if (state.inFlight) return;

  //   const isInitialLoad = state.tasks.length === 0;
  //   if (isInitialLoad) set({ loading: true });

  //   try {
  //     set({ loading: true, inFlight: true });

  //     const filter = buildFilter(params);
  //     const tasks = await pb
  //       .collection("tasks")
  //       .getFullList({ filter, sort: "+created" });

  //     set({
  //       tasks,
  //       lastFetched: Date.now(),
  //       currentParamsKey: key,
  //       loading: false,
  //       inFlight: false,
  //     });
  //   } catch (err) {
  //     // keep lastFetched unchanged on failure so we’ll retry on next tick
  //     set({ loading: false, inFlight: false });
  //     throw err;
  //   }
  // },

  fetchTasks: async (params) => {
    const fetchId = crypto.randomUUID();
    const startedAt = Date.now();
    set({ currentFetchId: fetchId, inFlight: true, loading: true });

    try {
      const filter = buildFilter(params);
      const tasks = await pb
        .collection("tasks")
        .getFullList({ filter, sort: "+created" });

      // only the latest request is allowed to commit
      if (get().currentFetchId !== fetchId) return;

      set({
        tasks,
        lastFetched: startedAt,
        currentParamsKey: paramsKey(params),
        inFlight: false,
        loading: false,
      });
    } catch (err) {
      // ignore abort-like errors below, see #2
      if (get().currentFetchId === fetchId)
        set({ inFlight: false, loading: false });
      throw err;
    }
  },

  /** Start polling with specific params and optional interval ms. */
  startPolling: (ms, params) => {
    // Always reset the interval when (re)starting so new params are respected
    const { pollingIntervalId } = get();
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }

    if (typeof ms === "number" && ms > 0) {
      set({ pollingMs: ms });
    }

    const intervalId = setInterval(() => {
      const { lastFetched, pollingMs, currentParamsKey, loading, inFlight } =
        get();

      // 1) If params changed since last fetch → fetch immediately
      const key = paramsKey(params);
      if (key !== currentParamsKey) {
        get().fetchTasks(params);
        return;
      }

      // 2) Time-based refresh every pollingMs from the last successful fetch
      if (!loading && !inFlight) {
        const now = Date.now();
        if (!lastFetched || now - lastFetched >= pollingMs) {
          get().fetchTasks(params);
        }
      }
    }, 5000); // check every 5s; light weight, responsive

    set({ pollingIntervalId: intervalId });
  },

  stopPolling: () => {
    const id = get().pollingIntervalId;
    if (id) {
      clearInterval(id);
      set({ pollingIntervalId: null });
    }
  },

  /** Convenience: fetch now, then start polling with the same params + interval. */
  startPollingWithImmediateFetch: (params, ms) => {
    get().fetchTasks(params);
    get().startPolling(ms, params);
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
