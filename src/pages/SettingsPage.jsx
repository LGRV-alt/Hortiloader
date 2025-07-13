import { useState, useEffect } from "react";
import { useUserSettings } from "../hooks/useUserSettings";
import pb from "../api/pbConnect";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function SettingsPage({ onSettingsChange }) {
  const { settings, updateSettings, fetchSettings } = useUserSettings(); // include fetchSettings
  const [form, setForm] = useState({});
  const [save, setSave] = useState(false);

  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    role: "staff",
    password: "",
    passwordConfirm: "",
  });

  const currentUser = pb.authStore.record;

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (currentUser.role === "admin" && currentUser.organization) {
      pb.collection("users")
        .getFullList({ filter: `organization="${currentUser.organization}"` })
        .then(setUsers)
        .catch(() => setUsers([]));
    }
    // Only run when org or role changes
  }, [currentUser.organization, currentUser.role]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSave(true);
    await updateSettings(form);
    onSettingsChange(); // Notify App
    await fetchSettings();
    toast.success("Settings saved!");
    setSave(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    // Optionally validate inputs here
    try {
      await pb.collection("users").create({
        ...newUser,
        organization: currentUser.organization,
        role: newUser.role || "staff",
        termsAgreement: {
          agreed: true,
          timestamp: new Date().toISOString(),
          version: "v1.0",
        },
      });

      toast.success("User invited!");
      setShowAddUser(false);
      setNewUser({ email: "", username: "", role: "staff" });
      // Refresh list
      const updated = await pb.collection("users").getFullList({
        filter: `organization="${currentUser.organization}"`,
      });
      setUsers(updated);
    } catch (err) {
      toast.error("Failed to invite user: " + (err.message || ""));
      console.error("Error details:", err.data);
    }
  };

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-2 p-4 bg-surface">
      <div className="flex flex-col items-center">
        {/* <h1 className="text-2xl font-bold mb-4">Settings</h1> */}
        <div className="bg-white w-full md:w-1/2 p-4 gap-4 rounded-2xl flex flex-col justify-center items-center mb-10 mt-10">
          <h3>Account Info</h3>
          <p>Username - {currentUser.username}</p>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Change Password
          </Link>
        </div>
        <div className="bg-white p-4 w-full md:w-1/2 gap-4 rounded-2xl flex flex-col justify-center items-center mb-10">
          <h3>User Agreement</h3>
          <Link to="/terms" className="text-blue-600 hover:underline text-sm">
            Terms and Conditions
          </Link>
          <Link to="/privacy" className="text-blue-600 hover:underline text-sm">
            Privacy Policy
          </Link>
        </div>
        <div className="bg-white p-4 w-full md:w-1/2 gap-4 rounded-2xl flex flex-col justify-center items-center">
          <h3> Contact & Feedback</h3>
          <p className="text-sm text-gray-600">
            We'd love to hear from you. If you have any questions, suggestions
            or problems, feel free to reach out.
          </p>
          <div>
            <span className="">Email:</span>{" "}
            <a
              href="mailto:support@hortiloader.com"
              className="text-blue-600 underline"
            >
              support@hortiloader.com
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center md:pt-0 pt-10">
        <h3 className="text-lg font-bold mb-4 ">Week Headings</h3>
        <div className="w-full md:w-1/2 p-4 flex justify-center bg-white rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-2">
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => (
              <div key={day}>
                <label className="block capitalize mb-1">{day} Heading</label>
                <input
                  type="text"
                  name={`${day}_heading`}
                  value={form[`${day}_heading`] || ""}
                  onChange={handleChange}
                  className="w-full border rounded p-1"
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded "
            >
              {!save ? "Save Settings" : "Saving..."}
            </button>
          </form>
        </div>
      </div>
      {currentUser.role === "admin" && (
        <div className="bg-white p-4 mt-10 w-full md:w-1/2 gap-4 rounded-2xl flex flex-col items-center">
          <h3 className="font-bold mb-2">Organization Users</h3>
          <ul className="w-full mb-4">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center border-b py-1"
              >
                <span>
                  {u.username} ({u.email}){" "}
                  {u.role === "admin" && <b>- Admin</b>}
                </span>
                {/* (Add Remove/Disable/Reset Button here, if not self) */}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowAddUser((s) => !s)}
            className="text-blue-600 underline"
          >
            {showAddUser ? "Cancel" : "Add New User"}
          </button>
          {showAddUser && (
            <form
              onSubmit={handleAddUser}
              className="flex flex-col gap-2 w-full mt-2"
            >
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, username: e.target.value }))
                }
                required
              />
              {/* <input
                className="border p-2 rounded"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, email: e.target.value }))
                }
                required
              /> */}
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, password: e.target.value }))
                }
                required
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Password Confirm"
                value={newUser.passwordConfirm}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, passwordConfirm: e.target.value }))
                }
                required
              />
              <select
                className="border p-2 rounded"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, role: e.target.value }))
                }
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                type="submit"
              >
                Invite User
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
