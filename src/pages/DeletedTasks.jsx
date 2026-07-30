/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";
import { FIELD_LABELS, formatHistoryValue } from "../utilis/taskFields";

const CORE_FIELDS = [
  "postcode",
  "orderNumber",
  "customerType",
  "day",
  "weekNumber",
  "year",
  "status",
  "trollies",
  "extras",
];

function DeletedTaskCard({ task, onRestore, onHardDelete, restoring, deleting }) {
  const [history, setHistory] = useState([]);
  const [historyFetched, setHistoryFetched] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = async () => {
    if (historyFetched) {
      setShowHistory((prev) => !prev);
      return;
    }
    setHistoryLoading(true);
    try {
      const records = await pb.collection("task_history").getFullList({
        filter: `task="${task.id}"`,
        sort: "-created",
        expand: "changed_by",
      });
      setHistory(records);
      setHistoryFetched(true);
      setShowHistory(true);
    } catch (err) {
      console.error("Could not load task history:", err);
      toast.error("Could not load task history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="shadow-lg shadow-gray-400 rounded-2xl border-[3px] border-darkBorder overflow-hidden dark:shadow-darkSecondary dark:bg-darkSecondary bg-white flex flex-col">
      <div className="dark:bg-darkMain bg-regal-blue text-white p-4">
        <h3 className="text-lg font-semibold capitalize truncate">
          {task.title}
        </h3>
        <p className="text-sm opacity-80">
          Deleted by{" "}
          {task.expand?.deleted_by?.display_username ||
            task.deleted_by ||
            "Unknown"}
          {task.deleted_at
            ? ` on ${new Date(task.deleted_at).toLocaleString()}`
            : ""}
        </p>
      </div>

      <div className="p-4 flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {CORE_FIELDS.map((field) => (
          <div key={field}>
            <span className="font-semibold">
              {FIELD_LABELS[field] || field}:{" "}
            </span>
            <span className="capitalize">
              {formatHistoryValue(task[field])}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400">
        Created by{" "}
        {task.expand?.created_by?.display_username ||
          task.created_by ||
          "Unknown"}
      </div>

      <div className="border-t dark:border-darkBorder">
        <button
          onClick={loadHistory}
          className="w-full flex justify-between items-center px-4 py-2 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-darkMain transition"
        >
          <span>History</span>
          <span>{historyLoading ? "Loading..." : showHistory ? "▲" : "▼"}</span>
        </button>
        {showHistory && (
          <div className="overflow-y-auto max-h-64 px-4 pb-3 flex flex-col gap-3 text-xs">
            {history.length === 0 ? (
              <p className="text-gray-500 italic">No changes recorded.</p>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="border-b border-gray-300 dark:border-darkBorder pb-2 last:border-none"
                >
                  <p className="font-semibold">
                    {entry.expand?.changed_by?.display_username || "Unknown"}{" "}
                    <span className="font-normal text-gray-500">
                      {new Date(entry.created).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </p>
                  <ul className="list-disc list-inside">
                    {Object.entries(entry.changes || {}).map(
                      ([field, { from, to }]) => (
                        <li key={field}>
                          {FIELD_LABELS[field] || field}:{" "}
                          {formatHistoryValue(from)} →{" "}
                          {formatHistoryValue(to)}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 border-t dark:border-darkBorder">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded font-semibold disabled:opacity-50"
          onClick={() => onRestore(task.id)}
          disabled={restoring}
        >
          {restoring ? "Restoring..." : "Restore"}
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded font-semibold disabled:opacity-50"
          onClick={() => onHardDelete(task.id)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Hard Delete"}
        </button>
      </div>
    </div>
  );
}

export default function DeletedTasks() {
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch deleted tasks on mount
  useEffect(() => {
    setLoading(true);
    pb.collection("tasks")
      .getFullList({
        filter: "deleted = true",
        sort: "-deleted_at",
        expand: "deleted_by,created_by",
      })
      .then((tasks) => setDeletedTasks(tasks))
      .catch(() => toast.error("Failed to load deleted tasks."))
      .finally(() => setLoading(false));
  }, []);

  // Hard delete a task
  const handleHardDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this item?")
    )
      return;
    try {
      setDeletingId(id);
      await pb.collection("tasks").delete(id);
      setDeletedTasks((tasks) => tasks.filter((t) => t.id !== id));
      toast.success("Task permanently deleted.");
    } catch (e) {
      toast.error("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  // Restore a task
  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await pb.collection("tasks").update(id, {
        deleted: false,
        deleted_by: null,
        deleted_at: null,
      });
      setDeletedTasks((tasks) => tasks.filter((t) => t.id !== id));
      toast.success("Task restored.");
    } catch (e) {
      toast.error("Restore failed.");
    } finally {
      setRestoringId(null);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (deletedTasks.length === 0)
    return <div className="p-6 text-center">No deleted tasks found.</div>;

  return (
    <div className="p-4 md:p-6 dark:bg-darkMain bg-white min-h-full w-full">
      <h2 className="text-xl text-center font-bold mb-4">Deleted Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deletedTasks.map((task) => (
          <DeletedTaskCard
            key={task.id}
            task={task}
            onRestore={handleRestore}
            onHardDelete={handleHardDelete}
            restoring={restoringId === task.id}
            deleting={deletingId === task.id}
          />
        ))}
      </div>
    </div>
  );
}
