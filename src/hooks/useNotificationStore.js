import { useMemo } from "react";
import { create } from "zustand";
import { useTaskStore } from "./useTaskStore";

const keyFor = (userId) => `new_tasks_last_seen_${userId}`;

// Tracks, per logged-in user, the timestamp of the last time they cleared
// the "new tasks" notification. Persisted to localStorage so it survives
// reloads/logins on the same browser.
export const useNotificationStore = create((set, get) => ({
  lastSeen: null,
  userId: null,

  // Seeds localStorage the first time a user is seen so pre-existing tasks
  // never show up as "new" — only tasks created after this point do.
  initLastSeen: (userId) => {
    if (!userId || get().userId === userId) return;
    const stored = Number(localStorage.getItem(keyFor(userId))) || null;
    const lastSeen = stored || Date.now();
    if (!stored) localStorage.setItem(keyFor(userId), String(lastSeen));
    set({ lastSeen, userId });
  },

  markAllSeen: () => {
    const { userId } = get();
    if (!userId) return;
    const now = Date.now();
    localStorage.setItem(keyFor(userId), String(now));
    set({ lastSeen: now });
  },
}));

// Tasks created after `lastSeen` — recomputes whenever the task store's
// `tasks` array changes (i.e. every poll tick or manual refresh), since
// fetchTasks always sets a fresh array reference.
export function useNewTaskIds() {
  const tasks = useTaskStore((state) => state.tasks);
  const lastSeen = useNotificationStore((state) => state.lastSeen);

  return useMemo(() => {
    const ids = new Set();
    if (!lastSeen) return ids;
    for (const task of tasks) {
      if (task.created && new Date(task.created).getTime() > lastSeen) {
        ids.add(task.id);
      }
    }
    return ids;
  }, [tasks, lastSeen]);
}
