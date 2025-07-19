import { useEffect, useState } from "react";
import pb from "../api/pbConnect";

import toast from "react-hot-toast";

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
        expand: "deleted_by",
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
      setDeletingId(null);
    } catch (e) {
      toast.error("Delete failed.");
      setDeletingId(null);
    }
  };

  // Optionally restore a task
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
      setRestoringId(null);
    } catch (e) {
      toast.error("Restore failed.");
      setRestoringId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (deletedTasks.length === 0) return <div>No deleted tasks found.</div>;

  return (
    <div className="md:p-4 bg-white h-full w-full">
      <div className="h-full flex flex-col items-center p-4">
        <h2 className="text-xl text-center font-bold mb-4">Deleted Tasks</h2>
        <table className="w-full md:w-2/3 md:text-lg text-sm text-center border-black border-2">
          <thead>
            <tr className="bg-gray-300">
              <th>Title</th>
              <th>Deleted By</th>
              <th>Deleted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deletedTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>
                  {task.expand?.deleted_by?.username ||
                    task.deleted_by ||
                    "Unknown"}
                </td>
                <td>
                  {task.deleted_at
                    ? new Date(task.deleted_at).toLocaleString()
                    : ""}
                </td>
                <td>
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded mr-2 my-2"
                    onClick={() => handleRestore(task.id)}
                    disabled={restoringId === task.id}
                  >
                    {restoringId === task.id ? "Restoring..." : "Restore"}
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleHardDelete(task.id)}
                    disabled={deletingId === task.id}
                  >
                    {deletingId === task.id ? "Deleting..." : "Hard Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
