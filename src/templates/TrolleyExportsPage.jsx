/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import pb from "../Components/lib/pbConnect";

export default function TrolleyExportsPage() {
  const [exports, setExports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [password, setPassword] = useState("");

  const CORRECT_PASSWORD = "stan666"; // 🔐 Change this or get from secure source

  useEffect(() => {
    const fetchExports = async () => {
      try {
        const records = await pb.collection("trolley_exports").getFullList({
          sort: "-created",
        });
        setExports(records);
      } catch (err) {
        console.error("Error fetching exports:", err);
      }
    };

    fetchExports();
  }, []);

  const promptDelete = (record) => {
    setSelectedRecord(record);
    setPassword("");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (password !== CORRECT_PASSWORD) {
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

  const handleClick = (record) => {
    console.log("Export record:", record);
  };

  return (
    <div className="mx-5 mt-5 relative">
      {exports.length === 0 ? (
        <p className="text-gray-500">No exports found.</p>
      ) : (
        exports.map((record) => (
          <div
            className="flex items-center justify-between border-b-2 border-slate-300 mb-5 cursor-pointer"
            key={record.id}
          >
            <div
              onClick={() => handleClick(record)}
              className="flex items-center hover:border-black hover:border-b-2"
            >
              <p className="text-blue-700 md:text-lg font-medium mr-4">
                {record.name || "Untitled Export"}
              </p>
              <p className="text-gray-600 text-sm">
                {new Date(record.created).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => promptDelete(record)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        ))
      )}

      {/* 🔐 Password Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-2 text-sm">Enter password to delete export:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
              placeholder="Password"
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
