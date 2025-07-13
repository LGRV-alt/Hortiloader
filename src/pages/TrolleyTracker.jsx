import { useEffect, useState } from "react";
import pb from "../api/pbConnect";
import { useNavigate } from "react-router-dom";

export default function TrolleyTrackerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerNotes, setNewCustomerNotes] = useState("");
  const [newCustomerContactInfo, setNewCustomerContactInfo] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Current user
  const user = pb.authStore.record;
  const userId = user.id;

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        // Fetch customers
        const customerRecords = await pb
          .collection("trolley_customers")
          .getFullList({
            filter: `user="${userId}"`,
            sort: "name",
          });

        if (customerRecords.length === 0) {
          setCustomers([]);
          setLoading(false);
          return;
        }
        console.log("Customers fetched:", customerRecords);

        // Fetch all movements for these customers in one request
        const customerIds = customerRecords.map((c) => c.id);
        let allMovements = [];
        if (customerIds.length === 1) {
          allMovements = await pb.collection("trolley_movements").getFullList({
            filter: `customer="${customerIds[0]}"`,
          });
        } else if (customerIds.length > 1) {
          const orFilters = customerIds
            .map((id) => `customer="${id}"`)
            .join(" || ");
          allMovements = await pb.collection("trolley_movements").getFullList({
            filter: orFilters,
          });
        }
        console.log("All movements fetched:", allMovements);

        // Group and calculate tallies
        const customersWithTallies = customerRecords.map((cust) => {
          const moves = allMovements.filter((m) => m.customer === cust.id);

          const trolliesOut = moves.reduce(
            (sum, m) => sum + (m.trollies_out || 0),
            0
          );
          const trolliesIn = moves.reduce(
            (sum, m) => sum + (m.trollies_in || 0),
            0
          );
          const shelvesOut = moves.reduce(
            (sum, m) => sum + (m.shelves_out || 0),
            0
          );
          const shelvesIn = moves.reduce(
            (sum, m) => sum + (m.shelves_in || 0),
            0
          );
          const extensionsOut = moves.reduce(
            (sum, m) => sum + (m.extensions_out || 0),
            0
          );
          const extensionsIn = moves.reduce(
            (sum, m) => sum + (m.extensions_in || 0),
            0
          );

          return {
            ...cust,
            trolliesOut,
            trolliesIn,
            trolliesOutstanding: trolliesOut - trolliesIn,
            shelvesOut,
            shelvesIn,
            shelvesOutstanding: shelvesOut - shelvesIn,
            extensionsOut,
            extensionsIn,
            extensionsOutstanding: extensionsOut - extensionsIn,
          };
        });

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
        contact_info: newCustomerContactInfo,
        user: userId,
      });
      // Add new customer to the list with zero tallies
      setCustomers((prev) => [
        ...prev,
        {
          ...created,
          trolliesOut: 0,
          trolliesIn: 0,
          trolliesOutstanding: 0,
          shelvesOut: 0,
          shelvesIn: 0,
          shelvesOutstanding: 0,
          extensionsOut: 0,
          extensionsIn: 0,
          extensionsOutstanding: 0,
        },
      ]);
      setShowAddModal(false);
      setNewCustomerName("");
      setNewCustomerNotes("");
      setNewCustomerContactInfo("");
      setError("");
    } catch (err) {
      setError("Failed to add customer.");
      console.error(err);
    }
  };

  const handleView = (customer) => {
    navigate(`/trollies/customer/${customer.id}`);
  };

  // Totals across all customers
  const totalTrolliesOut = customers.reduce(
    (sum, c) => sum + (c.trolliesOut || 0),
    0
  );
  const totalTrolliesIn = customers.reduce(
    (sum, c) => sum + (c.trolliesIn || 0),
    0
  );
  const totalTrolliesOutstanding = customers.reduce(
    (sum, c) => sum + (c.trolliesOutstanding || 0),
    0
  );

  const totalShelvesOut = customers.reduce(
    (sum, c) => sum + (c.shelvesOut || 0),
    0
  );
  const totalShelvesIn = customers.reduce(
    (sum, c) => sum + (c.shelvesIn || 0),
    0
  );
  const totalShelvesOutstanding = customers.reduce(
    (sum, c) => sum + (c.shelvesOutstanding || 0),
    0
  );

  const totalExtensionsOut = customers.reduce(
    (sum, c) => sum + (c.extensionsOut || 0),
    0
  );
  const totalExtensionsIn = customers.reduce(
    (sum, c) => sum + (c.extensionsIn || 0),
    0
  );
  const totalExtensionsOutstanding = customers.reduce(
    (sum, c) => sum + (c.extensionsOutstanding || 0),
    0
  );

  return (
    <div className="mx-5 mt-5 relative max-w-6xl">
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
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="min-w-full table-auto text-xs md:text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-2" rowSpan={2}>
                Customer
              </th>
              <th className="text-center py-2 px-2" colSpan={3}>
                Trollies
              </th>
              <th className="text-center py-2 px-2" colSpan={3}>
                Shelves
              </th>
              <th className="text-center py-2 px-2" colSpan={3}>
                Extensions
              </th>
              <th rowSpan={2}></th>
            </tr>
            <tr>
              <th className="text-center py-2 px-2">Out</th>
              <th className="text-center py-2 px-2">In</th>
              <th className="text-center py-2 px-2">Outstanding</th>
              <th className="text-center py-2 px-2">Out</th>
              <th className="text-center py-2 px-2">In</th>
              <th className="text-center py-2 px-2">Outstanding</th>
              <th className="text-center py-2 px-2">Out</th>
              <th className="text-center py-2 px-2">In</th>
              <th className="text-center py-2 px-2">Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-500">
                  No customers yet. Add your first!
                </td>
              </tr>
            ) : (
              customers.map((cust) => (
                <tr key={cust.id} className="border-t">
                  <td className="py-2 px-2 font-medium">{cust.name}</td>
                  {/* Trollies */}
                  <td className="py-2 px-2 text-center">{cust.trolliesOut}</td>
                  <td className="py-2 px-2 text-center">{cust.trolliesIn}</td>
                  <td className="py-2 px-2 text-center font-bold">
                    {cust.trolliesOutstanding}
                  </td>
                  {/* Shelves */}
                  <td className="py-2 px-2 text-center">{cust.shelvesOut}</td>
                  <td className="py-2 px-2 text-center">{cust.shelvesIn}</td>
                  <td className="py-2 px-2 text-center font-bold">
                    {cust.shelvesOutstanding}
                  </td>
                  {/* Extensions */}
                  <td className="py-2 px-2 text-center">
                    {cust.extensionsOut}
                  </td>
                  <td className="py-2 px-2 text-center">{cust.extensionsIn}</td>
                  <td className="py-2 px-2 text-center font-bold">
                    {cust.extensionsOutstanding}
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
          <tfoot>
            <tr className="font-bold bg-gray-50 border-t-2">
              <td className="py-2 px-2 text-right">Total:</td>
              <td className="py-2 px-2 text-center">{totalTrolliesOut}</td>
              <td className="py-2 px-2 text-center">{totalTrolliesIn}</td>
              <td className="py-2 px-2 text-center">
                {totalTrolliesOutstanding}
              </td>
              <td className="py-2 px-2 text-center">{totalShelvesOut}</td>
              <td className="py-2 px-2 text-center">{totalShelvesIn}</td>
              <td className="py-2 px-2 text-center">
                {totalShelvesOutstanding}
              </td>
              <td className="py-2 px-2 text-center">{totalExtensionsOut}</td>
              <td className="py-2 px-2 text-center">{totalExtensionsIn}</td>
              <td className="py-2 px-2 text-center">
                {totalExtensionsOutstanding}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-xl text-center font-bold mb-3">Add Customer</h2>
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
              placeholder="Address/Postcode (optional)"
              value={newCustomerNotes}
              onChange={(e) => setNewCustomerNotes(e.target.value)}
            />
            <textarea
              className="border p-2 w-full rounded mb-4"
              placeholder="Email/Mobile (pptional)"
              value={newCustomerContactInfo}
              onChange={(e) => setNewCustomerContactInfo(e.target.value)}
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
