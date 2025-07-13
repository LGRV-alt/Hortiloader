/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import pb from "../api/pbConnect";
import { useNavigate } from "react-router-dom";

export default function TrolleyTrackerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerNotes, setNewCustomerNotes] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Assuming current user is always available in authStore.model
  const user = pb.authStore.record;
  const userId = user.id;

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        // Fetch only this user's customers
        const records = await pb.collection("trolley_customers").getFullList({
          filter: `user="${userId}"`,
          sort: "name",
          expand: "movements", // You can also fetch related trolley_movements if you want
        });

        // For each customer, fetch trolley movements and compute tally
        // (If you expand, you might have `record.expand.movements`)
        const customersWithTallies = await Promise.all(
          records.map(async (cust) => {
            // Fetch all movements for this customer
            const moves = await pb.collection("trolley_movements").getFullList({
              filter: `customer="${cust.id}"`,
            });

            const trolliesOut = moves.reduce(
              (sum, m) => sum + (m.trollies_out || 0),
              0
            );
            const trolliesIn = moves.reduce(
              (sum, m) => sum + (m.trollies_in || 0),
              0
            );

            return {
              ...cust,
              trolliesOut,
              trolliesIn,
              total: trolliesOut - trolliesIn,
            };
          })
        );

        setCustomers(customersWithTallies);
      } catch (err) {
        setError("Failed to load customers.");
        console.error(err);
      }
      setLoading(false);
    }

    fetchCustomers();
  }, [userId]);

  const handleAddCustomer = async () => {
    if (!newCustomerName.trim()) return;
    try {
      const created = await pb.collection("trolley_customers").create({
        name: newCustomerName,
        notes: newCustomerNotes,
        user: userId,
      });
      // Add new customer to the list with zero tallies
      setCustomers((prev) => [
        ...prev,
        { ...created, trolliesOut: 0, trolliesIn: 0, total: 0 },
      ]);
      setShowAddModal(false);
      setNewCustomerName("");
      setNewCustomerNotes("");
      setError("");
    } catch (err) {
      setError("Failed to add customer.");
      console.error(err);
    }
  };

  const handleView = (customer) => {
    // Route to details page (you'll want to build this)
    navigate(`/trollies/customer/${customer.id}`);
  };

  return (
    <div className="mx-5 mt-5 relative max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Trolley Tracker</h1>
      <p className="mb-4 text-gray-500">Only your customers are shown below.</p>
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-green-700 text-white rounded-2xl shadow hover:bg-green-800"
          onClick={() => setShowAddModal(true)}
        >
          + Add Customer
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="text-left py-2 px-2">Customer</th>
              <th className="text-center py-2 px-2">Out</th>
              <th className="text-center py-2 px-2">In</th>
              <th className="text-center py-2 px-2">Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No customers yet. Add your first!
                </td>
              </tr>
            ) : (
              customers.map((cust) => (
                <tr key={cust.id} className="border-t">
                  <td className="py-2 px-2">{cust.name}</td>
                  <td className="py-2 px-2 text-center">{cust.trolliesOut}</td>
                  <td className="py-2 px-2 text-center">{cust.trolliesIn}</td>
                  <td className="py-2 px-2 text-center font-bold">
                    {cust.total}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => handleView(cust)}
                      className="bg-gray-200 hover:bg-gray-300 rounded-xl px-3 py-1 text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-3">Add Customer</h2>
            <input
              className="border p-2 w-full rounded mb-4"
              type="text"
              placeholder="Customer Name"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              autoFocus
            />
            <textarea
              className="border p-2 w-full rounded mb-4"
              placeholder="Notes (optional)"
              value={newCustomerNotes}
              onChange={(e) => setNewCustomerNotes(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-700 text-white rounded-2xl shadow hover:bg-green-800"
                onClick={handleAddCustomer}
              >
                Add
              </button>
            </div>
            {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
