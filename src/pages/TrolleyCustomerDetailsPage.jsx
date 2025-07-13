import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";
// import MovementFileUpload from "../Components/MovementFileUpload";

export default function TrolleyCustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  //   Edit Customer Details
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editContactInfo, setEditContactInfo] = useState("");
  const [saving, setSaving] = useState(false);

  // Movement form state
  const [trolliesOut, setTrolliesOut] = useState("");
  const [trolliesIn, setTrolliesIn] = useState("");
  const [shelvesOut, setShelvesOut] = useState("");
  const [shelvesIn, setShelvesIn] = useState("");
  const [extensionsOut, setExtensionsOut] = useState("");
  const [extensionsIn, setExtensionsIn] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  // For editing/deleting
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(null);

  // File upload after add
  //   const [lastCreatedId, setLastCreatedId] = useState(null);

  // For reloading movement files after upload/delete
  const [reloadMovements, setReloadMovements] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cust = await pb.collection("trolley_customers").getOne(id);
        setCustomer(cust);
        const moves = await pb.collection("trolley_movements").getFullList({
          filter: `customer="${id}"`,
          sort: "date",
        });
        setMovements(moves);
      } catch (err) {
        setError("Could not load customer details.");
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [id, reloadMovements]);

  // Running balance
  const runningBalances = [];
  let trolliesBal = 0,
    shelvesBal = 0,
    extensionsBal = 0;
  movements.forEach((move) => {
    trolliesBal += (move.trollies_out || 0) - (move.trollies_in || 0);
    shelvesBal += (move.shelves_out || 0) - (move.shelves_in || 0);
    extensionsBal += (move.extensions_out || 0) - (move.extensions_in || 0);
    runningBalances.push({
      trollies: trolliesBal,
      shelves: shelvesBal,
      extensions: extensionsBal,
    });
  });

  // Outstanding
  const totalTrolliesOut = movements.reduce(
    (sum, m) => sum + (m.trollies_out || 0),
    0
  );
  const totalTrolliesIn = movements.reduce(
    (sum, m) => sum + (m.trollies_in || 0),
    0
  );
  const totalShelvesOut = movements.reduce(
    (sum, m) => sum + (m.shelves_out || 0),
    0
  );
  const totalShelvesIn = movements.reduce(
    (sum, m) => sum + (m.shelves_in || 0),
    0
  );
  const totalExtensionsOut = movements.reduce(
    (sum, m) => sum + (m.extensions_out || 0),
    0
  );
  const totalExtensionsIn = movements.reduce(
    (sum, m) => sum + (m.extensions_in || 0),
    0
  );

  // Add movement
  const handleAddMovement = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !trolliesOut &&
      !trolliesIn &&
      !shelvesOut &&
      !shelvesIn &&
      !extensionsOut &&
      !extensionsIn
    ) {
      setError("Enter at least one value.");
      return;
    }
    setAdding(true);
    try {
      const created = await pb.collection("trolley_movements").create({
        customer: id,
        trollies_out: Number(trolliesOut) || 0,
        trollies_in: Number(trolliesIn) || 0,
        shelves_out: Number(shelvesOut) || 0,
        shelves_in: Number(shelvesIn) || 0,
        extensions_out: Number(extensionsOut) || 0,
        extensions_in: Number(extensionsIn) || 0,
        notes,
        date: new Date().toISOString(),
        user: pb.authStore.record.id,
      });
      setTrolliesOut("");
      setTrolliesIn("");
      setShelvesOut("");
      setShelvesIn("");
      setExtensionsOut("");
      setExtensionsIn("");
      setNotes("");
      //   setLastCreatedId(created.id); // trigger upload UI
      setReloadMovements((r) => !r);
    } catch (err) {
      setError("Failed to add movement.");
      console.error(err);
    }
    setAdding(false);
  };

  // Delete movement
  const handleDelete = async () => {
    if (!showDelete) return;
    try {
      await pb.collection("trolley_movements").delete(showDelete);
      setShowDelete(null);
      setReloadMovements((r) => !r);
    } catch (err) {
      alert("Could not delete movement.");
      console.error(err);
    }
  };

  // Edit movement
  const openEdit = (move) => {
    setEditing({
      ...move,
      trollies_out: move.trollies_out || "",
      trollies_in: move.trollies_in || "",
      shelves_out: move.shelves_out || "",
      shelves_in: move.shelves_in || "",
      extensions_out: move.extensions_out || "",
      extensions_in: move.extensions_in || "",
    });
  };

  // Save edit
  const handleEditSave = async () => {
    try {
      await pb.collection("trolley_movements").update(editing.id, {
        trollies_out: Number(editing.trollies_out) || 0,
        trollies_in: Number(editing.trollies_in) || 0,
        shelves_out: Number(editing.shelves_out) || 0,
        shelves_in: Number(editing.shelves_in) || 0,
        extensions_out: Number(editing.extensions_out) || 0,
        extensions_in: Number(editing.extensions_in) || 0,
        notes: editing.notes,
      });
      setEditing(null);
      setReloadMovements((r) => !r);
    } catch (err) {
      alert("Could not update movement.");
      console.error(err);
    }
  };
  const handleEditCancel = () => setEditing(null);

  // Delete file from movement
  //   const handleDeleteFile = async (movement, filename) => {
  //     try {
  //       const newFiles = (movement.files || []).filter((f) => f !== filename);
  //       await pb.collection("trolley_movements").update(movement.id, {
  //         files: newFiles,
  //       });
  //       toast.success("File deleted");
  //       setReloadMovements((r) => !r);
  //     } catch (err) {
  //       toast.error("Failed to delete file");
  //       console.error(err);
  //     }
  //   };

  return (
    <div className="max-w-full mx-auto pt-2 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center ">
            <h2 className="text-2xl font-bold">
              {customer.name}{" "}
              <span>
                {" "}
                <button
                  className="text-blue-600 hover:underline text-xs"
                  onClick={() => {
                    setEditName(customer.name);
                    setEditNotes(customer.notes || "");
                    setEditContactInfo(customer.contact_info || "");
                    setEditingCustomer(true);
                  }}
                >
                  Edit
                </button>
              </span>
            </h2>
            <p className="text-gray-500">{customer.notes.toUpperCase()}</p>
            <p className="text-gray-500">{customer.contact_info}</p>
          </div>

          {/* -----------------------------------Edit customer modal------------------------------------ */}
          {editingCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">Edit Account Details</h2>
                <input
                  className="border p-2 w-full rounded mb-2"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                />
                <textarea
                  className="border p-2 w-full rounded mb-2"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Address/Postcode (optional)"
                  rows={2}
                />
                <textarea
                  className="border p-2 w-full rounded mb-4"
                  value={editContactInfo}
                  onChange={(e) => setEditContactInfo(e.target.value)}
                  placeholder="Contact Info (optional)"
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    onClick={() => setEditingCustomer(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                    onClick={async () => {
                      try {
                        setSaving(true);
                        await pb
                          .collection("trolley_customers")
                          .update(customer.id, {
                            name: editName,
                            notes: editNotes,
                            contact_info: editContactInfo,
                          });
                        setSaving(false);
                        toast.success("User Updated");
                        setEditingCustomer(false);
                        setReloadMovements((r) => !r); // This will refetch customer
                      } catch (err) {
                        alert("Could not update customer.");
                        console.error(err);
                      }
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Outstanding summary */}
          <div className="mb-4 flex flex-wrap gap-4">
            <span className="text-lg font-bold">Outstanding:</span>
            <span className="text-lg">
              Trollies: <b>{totalTrolliesOut - totalTrolliesIn}</b>
            </span>
            <span className="text-lg">
              Shelves: <b>{totalShelvesOut - totalShelvesIn}</b>
            </span>
            <span className="text-lg">
              Extensions: <b>{totalExtensionsOut - totalExtensionsIn}</b>
            </span>
          </div>

          {/* Add movement form */}
          <form
            onSubmit={handleAddMovement}
            className="bg-gray-50 p-4 rounded-xl mb-6 shadow"
          >
            <h3 className="font-semibold mb-2">Add Movement</h3>
            <div className="flex gap-2 mb-2 flex-wrap">
              <input
                type="number"
                min="0"
                className="border p-2 rounded"
                placeholder="Trollies out"
                value={trolliesOut}
                onChange={(e) => setTrolliesOut(e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="border p-2 rounded"
                placeholder="Trollies in"
                value={trolliesIn}
                onChange={(e) => setTrolliesIn(e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="border p-2 rounded"
                placeholder="Shelves out"
                value={shelvesOut}
                onChange={(e) => setShelvesOut(e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="border p-2 rounded"
                placeholder="Shelves in"
                value={shelvesIn}
                onChange={(e) => setShelvesIn(e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="border p-2 rounded"
                placeholder="Extensions out"
                value={extensionsOut}
                onChange={(e) => setExtensionsOut(e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="border p-2 rounded"
                placeholder="Extensions in"
                value={extensionsIn}
                onChange={(e) => setExtensionsIn(e.target.value)}
              />
            </div>
            <textarea
              className="border p-2 w-full rounded mb-2"
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 bg-green-700 text-white rounded-xl shadow hover:bg-green-800"
            >
              {adding ? "Adding..." : "Add Movement"}
            </button>
            {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
          </form>

          {/* Show file upload for new movement */}
          {/* {lastCreatedId && (
            <div className="my-4 border rounded-xl p-3 bg-gray-100">
              <div className="mb-1 font-bold">
                Attach files to new movement:
              </div>
              <MovementFileUpload
                movementID={lastCreatedId}
                onUploaded={() => {
                  setLastCreatedId(null);
                  setReloadMovements((r) => !r);
                }}
              />
            </div>
          )} */}

          <h3 className="font-semibold mb-2">Trolley History</h3>
          {movements.length === 0 ? (
            <div className="text-gray-500">
              No trolley movements recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mb-10 text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2">Date</th>
                    <th className="text-center py-2">Trollies Out</th>
                    <th className="text-center py-2">Trollies In</th>
                    <th className="text-center py-2">Shelves Out</th>
                    <th className="text-center py-2">Shelves In</th>
                    <th className="text-center py-2">Ext. Out</th>
                    <th className="text-center py-2">Ext. In</th>
                    <th className="text-left py-2">Notes</th>
                    <th className="text-center py-2">Trollies Bal</th>
                    <th className="text-center py-2">Shelves Bal</th>
                    <th className="text-center py-2">Ext. Bal</th>
                    <th className="text-center py-2">Files</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((move, idx) => (
                    <tr key={move.id} className="border-t align-top">
                      {editing?.id === move.id ? (
                        <>
                          <td className="py-2">
                            {new Date(move.date).toLocaleDateString()}{" "}
                            {new Date(move.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-2 text-center">
                            <input
                              type="number"
                              min="0"
                              className="border p-1 rounded w-12"
                              value={editing.trollies_out}
                              onChange={(e) =>
                                setEditing((ed) => ({
                                  ...ed,
                                  trollies_out: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="py-2 text-center">
                            <input
                              type="number"
                              min="0"
                              className="border p-1 rounded w-12"
                              value={editing.trollies_in}
                              onChange={(e) =>
                                setEditing((ed) => ({
                                  ...ed,
                                  trollies_in: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="py-2 text-center">
                            <input
                              type="number"
                              min="0"
                              className="border p-1 rounded w-12"
                              value={editing.shelves_out}
                              onChange={(e) =>
                                setEditing((ed) => ({
                                  ...ed,
                                  shelves_out: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="py-2 text-center">
                            <input
                              type="number"
                              min="0"
                              className="border p-1 rounded w-12"
                              value={editing.shelves_in}
                              onChange={(e) =>
                                setEditing((ed) => ({
                                  ...ed,
                                  shelves_in: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="py-2 text-center">
                            <input
                              type="number"
                              min="0"
                              className="border p-1 rounded w-12"
                              value={editing.extensions_out}
                              onChange={(e) =>
                                setEditing((ed) => ({
                                  ...ed,
                                  extensions_out: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="py-2 text-center">
                            <input
                              type="number"
                              min="0"
                              className="border p-1 rounded w-12"
                              value={editing.extensions_in}
                              onChange={(e) =>
                                setEditing((ed) => ({
                                  ...ed,
                                  extensions_in: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="text"
                              className="border p-1 rounded w-full"
                              value={editing.notes}
                              onChange={(e) =>
                                setEditing((ed) => ({
                                  ...ed,
                                  notes: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="py-2 text-center">
                            {runningBalances[idx].trollies}
                          </td>
                          <td className="py-2 text-center">
                            {runningBalances[idx].shelves}
                          </td>
                          <td className="py-2 text-center">
                            {runningBalances[idx].extensions}
                          </td>

                          {/* ---------------File Upload----------------- */}
                          {/* <td className="py-2 text-center align-top">
                            {editing?.id === move.id ? (
                              <>
                                <MovementFileUpload
                                  movementID={move.id}
                                  onUploaded={() =>
                                    setReloadMovements((r) => !r)
                                  }
                                />
                                <div className="flex flex-col gap-1 mt-2">
                                  {(move.files || []).map((file) => (
                                    <div
                                      key={file}
                                      className="flex items-center gap-2"
                                    >
                                      {file.toLowerCase().endsWith(".pdf") ? (
                                        <a
                                          href={pb.files.getUrl(move, file)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 underline"
                                        >
                                          PDF
                                        </a>
                                      ) : (
                                        <img
                                          src={pb.files.getUrl(move, file)}
                                          alt="Movement file"
                                          className="w-10 h-10 rounded object-cover"
                                        />
                                      )}
                                      <button
                                        className="text-xs text-red-500 hover:underline"
                                        onClick={() =>
                                          handleDeleteFile(move, file)
                                        }
                                        type="button"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col gap-1">
                                {(move.files || []).map((file) => (
                                  <div
                                    key={file}
                                    className="flex items-center gap-2"
                                  >
                                    {file.toLowerCase().endsWith(".pdf") ? (
                                      <a
                                        href={pb.files.getUrl(move, file)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                      >
                                        PDF
                                      </a>
                                    ) : (
                                      <img
                                        src={pb.files.getUrl(move, file)}
                                        alt="Movement file"
                                        className="w-10 h-10 rounded object-cover"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td> */}
                          <td className="py-2 text-center">
                            <button
                              onClick={handleEditSave}
                              className="bg-green-600 text-white px-2 py-1 rounded mr-1 text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="bg-gray-300 text-black px-2 py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2">
                            {new Date(move.date).toLocaleDateString()}{" "}
                            {new Date(move.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-2 text-center">
                            {move.trollies_out}
                          </td>
                          <td className="py-2 text-center">
                            {move.trollies_in}
                          </td>
                          <td className="py-2 text-center">
                            {move.shelves_out}
                          </td>
                          <td className="py-2 text-center">
                            {move.shelves_in}
                          </td>
                          <td className="py-2 text-center">
                            {move.extensions_out}
                          </td>
                          <td className="py-2 text-center">
                            {move.extensions_in}
                          </td>
                          <td className="py-2">{move.notes}</td>
                          <td className="py-2 text-center">
                            {runningBalances[idx].trollies}
                          </td>
                          <td className="py-2 text-center">
                            {runningBalances[idx].shelves}
                          </td>
                          <td className="py-2 text-center">
                            {runningBalances[idx].extensions}
                          </td>
                          {/* ----------File Upload--------------- */}
                          {/* <td className="py-2 text-center">
                            <div className="flex flex-col gap-1 mt-2">
                              {(move.files || []).map((file) => (
                                <div
                                  key={file}
                                  className="flex items-center gap-2"
                                >
                                  {file.toLowerCase().endsWith(".pdf") ? (
                                    <a
                                      href={pb.files.getUrl(move, file)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 underline"
                                    >
                                      PDF
                                    </a>
                                  ) : (
                                    <img
                                      src={pb.files.getUrl(move, file)}
                                      alt="Movement file"
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </td> */}
                          <td className="py-2 text-center">
                            <button
                              onClick={() => openEdit(move)}
                              className="text-blue-600 hover:underline text-xs mr-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setShowDelete(move.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4 text-sm">
              Are you sure you want to delete this movement? This cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDelete(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
