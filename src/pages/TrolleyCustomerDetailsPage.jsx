/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import pb from "../api/pbConnect";
import { useParams, useNavigate } from "react-router-dom";

export default function TrolleyCustomerDetailsPage() {
  const { id } = useParams(); // customer id
  const navigate = useNavigate();
  console.log(pb.authStore.record);

  const [customer, setCustomer] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trolliesOut, setTrolliesOut] = useState("");
  const [trolliesIn, setTrolliesIn] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch customer + movements
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch customer
        const cust = await pb.collection("trolley_customers").getOne(id);
        setCustomer(cust);

        // Fetch movements for this customer
        const moves = await pb.collection("trolley_movements").getFullList({
          filter: `customer="${id}"`,
          sort: "-date",
        });
        setMovements(moves);
      } catch (err) {
        setError("Could not load customer details.");
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  // Calculate total
  const totalOut = movements.reduce((sum, m) => sum + (m.trollies_out || 0), 0);
  const totalIn = movements.reduce((sum, m) => sum + (m.trollies_in || 0), 0);
  const runningTotal = totalOut - totalIn;

  // Add a new movement (in/out)
  const handleAddMovement = async (e) => {
    e.preventDefault();
    setError("");
    if (!trolliesOut && !trolliesIn) {
      setError("Please enter trollies out and/or in.");
      return;
    }
    setAdding(true);
    try {
      await pb.collection("trolley_movements").create({
        customer: id,
        trollies_out: Number(trolliesOut) || 0,
        trollies_in: Number(trolliesIn) || 0,
        notes,
        date: new Date().toISOString(),
        user: pb.authStore.record.id,
      });
      setTrolliesOut("");
      setTrolliesIn("");
      setNotes("");
      // Re-fetch movements
      const moves = await pb.collection("trolley_movements").getFullList({
        filter: `customer="${id}"`,
        sort: "-date",
      });
      setMovements(moves);
    } catch (err) {
      setError("Failed to add movement.");
      console.error(err);
    }
    setAdding(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
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
          <h2 className="text-2xl font-bold mb-2">{customer.name}</h2>
          {customer.notes && (
            <p className="text-gray-500 mb-2">{customer.notes}</p>
          )}

          <div className="mb-4">
            <span className="text-lg">
              Total trollies out: <b>{totalOut}</b>
            </span>
            <span className="ml-4 text-lg">
              in: <b>{totalIn}</b>
            </span>
            <span className="ml-4 text-lg font-bold">
              Balance: {runningTotal}
            </span>
          </div>

          {/* Add movement form */}
          <form
            onSubmit={handleAddMovement}
            className="bg-gray-50 p-4 rounded-xl mb-6 shadow"
          >
            <h3 className="font-semibold mb-2">Add Movement</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                min="0"
                className="border p-2 rounded w-32"
                placeholder="Trollies out"
                value={trolliesOut}
                onChange={(e) => setTrolliesOut(e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="border p-2 rounded w-32"
                placeholder="Trollies in"
                value={trolliesIn}
                onChange={(e) => setTrolliesIn(e.target.value)}
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

          <h3 className="font-semibold mb-2">Trolley History</h3>
          {movements.length === 0 ? (
            <div className="text-gray-500">
              No trolley movements recorded yet.
            </div>
          ) : (
            <table className="w-full mb-10 text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-center py-2">Out</th>
                  <th className="text-center py-2">In</th>
                  <th className="text-left py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((move) => (
                  <tr key={move.id} className="border-t">
                    <td className="py-2">
                      {new Date(move.date).toLocaleDateString()}{" "}
                      {new Date(move.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 text-center">{move.trollies_out}</td>
                    <td className="py-2 text-center">{move.trollies_in}</td>
                    <td className="py-2">{move.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
