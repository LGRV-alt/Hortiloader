/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import pb from "../api/pbConnect";
import { useNavigate } from "react-router-dom";

const PER_PAGE = 10;

export default function TrolleyExportsPage() {
  const [exports, setExports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const user = pb.authStore.record;
  const userName = user.username.toLowerCase();

  const fetchPage = async (pageNum) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await pb
        .collection("trolley_exports")
        .getList(pageNum, PER_PAGE, {
          sort: "-created",
          filter: `organization="${user.organization}"`,
        });

      setExports((prev) => [...prev, ...result.items]);
      setTotalPages(result.totalPages);
      setHasMore(pageNum < result.totalPages);
    } catch (err) {
      console.error("Error fetching exports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load first page on mount
  useEffect(() => {
    fetchPage(1);
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
      fetchPage(page + 1);
    }
  };

  const promptDelete = (record) => {
    setSelectedRecord(record);
    setPassword("");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (password !== userName) {
      alert("Incorrect password.");
      return;
    }

    try {
      await pb.collection("trolley_exports").delete(selectedRecord.id);
      setExports((prev) => prev.filter((rec) => rec.id !== selectedRecord.id));
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting export:", err);
    }
  };

  // Stop the dispatch option triggering the parents onclick event
  const handleClick = (e, record) => {
    if (e.target.tagName === "SELECT" || e.target.tagName === "OPTION") {
      return;
    }
    if (e.target.closest("select")) {
      return;
    }
    navigate(`/runs/view/${record.id}`);
  };

  const updateDispatchStatus = async (recordId, newStatus) => {
    const now = new Date().toISOString();

    try {
      setExports((prev) =>
        prev.map((rec) => {
          if (rec.id !== recordId) return rec;

          const shouldSetDispatchedAt =
            newStatus === "dispatched" && !rec.dispatched_at;

          return {
            ...rec,
            dispatch_status: newStatus,
            dispatched_at: shouldSetDispatchedAt ? now : rec.dispatched_at,
          };
        }),
      );

      const updatePayload = {
        dispatch_status: newStatus,
      };

      // Only set timestamp once
      if (newStatus === "dispatched") {
        updatePayload.dispatched_at = now;
      }

      await pb.collection("trolley_exports").update(recordId, updatePayload);
    } catch (err) {
      console.error("Failed to update dispatch status:", err);
    }
  };

  const chip = {
    processing: "bg-yellow-400 text-yellow-800 border-yellow-200",
    new: "bg-red-300 text-red-800 border-red-200",
    dispatched: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  // const DISPATCHED_STATUS = "dispatched";

  return (
    <div className="md:grid md:grid-cols-2 flex flex-col gap-4 h-full md:p-6 p-2 md:gap-2 bg-[#edf5ff]">
      {exports.length === 0 && !isLoading ? (
        <p className="text-gray-500 text-center">No runs found.</p>
      ) : (
        <>
          {exports.map((record, index) => (
            <div
              key={index}
              className=" rounded-2xl border-2 b-[#D8E0EA] bg-[#f3f7f9] "
            >
              <div className=" bg-[#d5ecff] rounded-t-xl min-h-24 flex flex-col gap-2">
                <div className="flex justify-between pt-2 px-4">
                  <div className="flex items-center">
                    <p className=" md:text-xl text-sm font-medium me-2 ">
                      {record.name.toUpperCase() || "Untitled Export"}
                    </p>
                    {user.role === "admin" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          promptDelete(record);
                        }}
                        className="text-red-500 md:w-auto hidden  md:flex justify-center items-center hover:text-red-800 hover:underline md:text-sm text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <button
                    className="text-[#2563EB] hover:text-blue-400 hover:underline md:text-base text-sm"
                    onClick={(e) => handleClick(e, record)}
                  >
                    View Run
                  </button>
                </div>

                <div className="px-2 pb-2 flex justify-start items-center gap-2">
                  <span
                    className={`hover:bg-white hover:text-black font-semibold text-sm md:text-base w-auto self-center px-6 py-1 rounded-full border  ${
                      chip[record.dispatch_status] || chip.new
                    }`}
                  >
                    <select
                      value={record.dispatch_status || "new"}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateDispatchStatus(record.id, e.target.value)
                      }
                      className="cursor-pointer bg-transparent text-center outline-none appearance-none"
                    >
                      <option value="new">New</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                    </select>
                  </span>
                  {record.dispatch_status === "dispatched" && (
                    <p className="text-xs text-gray-500">
                      Dispatched on{" "}
                      {new Date(record.dispatched_at).toLocaleString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
              <div className="px-2 pt-2 pb-5">
                {record.data.map((task, index) => (
                  <div className="flex gap-2 text-xs md:text-base" key={index}>
                    <p>{index + 1} - </p>
                    <p
                      className={`font-normal capitalize  ${
                        task.customerType === "retail"
                          ? "text-blue-700"
                          : task.customerType === "other"
                            ? "text-red-500"
                            : task.customerType === "missed"
                              ? "text-fuchsia-600"
                              : ""
                      }`}
                    >
                      {task.title} - {task.postcode.toUpperCase()}{" "}
                      {task.orderNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="w-full text-center col-span-2">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className={`
                  px-8 py-3 rounded-lg font-medium text-white transition
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                `}
              >
                {isLoading ? "Loading..." : "Load More Runs"}
              </button>
            </div>
          )}

          {!hasMore && exports.length > 0 && (
            <p className="text-gray-500 text-sm text-center py-6">
              All runs loaded
            </p>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-2 text-sm">
              Enter username to delete:{" "}
              <span className="font-bold">{userName}</span>
            </p>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
