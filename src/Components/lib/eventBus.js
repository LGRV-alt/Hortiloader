const listeners = new Set();

export const onRefetchTasks = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const emitRefetchTasks = () => {
  for (const fn of listeners) fn();
};
