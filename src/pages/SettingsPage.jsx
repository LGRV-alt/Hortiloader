import { useState, useEffect } from "react";
import pb from "../api/pbConnect";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSettingsStore } from "../hooks/useSettingsStore";

export default function SettingsPage({}) {
  const [form, setForm] = useState({});
  const [save, setSave] = useState(false);
  const [orgName, setOrgName] = useState(null);

  const [resetUser, setResetUser] = useState(null); // user to reset password for
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const { settings, updateSettings } = useSettingsStore();

  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    role: "staff",
    password: "",
    passwordConfirm: "",
  });

  const SUBUSER_LIMIT = 8;
  const subuserCount = users.length; // this already includes the admin

  const currentUser = pb.authStore.record;

  useEffect(() => {
    let isMounted = true;
    if (currentUser.organization) {
      pb.collection("organization")
        .getOne(currentUser.organization)
        .then((org) => {
          if (isMounted) setOrgName(org.name);
        })
        .catch(() => {
          if (isMounted) setOrgName("Unknown");
        });
    }
    return () => {
      isMounted = false;
    }; // Prevent state update if unmounted
  }, [currentUser.organization]);

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
    toast.success("Settings saved!");
    setSave(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const display_username = newUser.username;
    const username = `${orgName}-${newUser.username}`;
    const password = newUser.password;
    const passwordConfirm = newUser.passwordConfirm;

    if (subuserCount >= SUBUSER_LIMIT) {
      toast.error(
        `You can only have ${SUBUSER_LIMIT} users in your organization.`
      );
      return;
    }
    // Optionally validate inputs here
    try {
      await pb.collection("users").create({
        username: username,
        password: password,
        passwordConfirm: passwordConfirm,
        display_username: display_username,
        organization: currentUser.organization,
        role: newUser.role || "staff",
        termsAgreement: {
          agreed: true,
          timestamp: new Date().toISOString(),
          version: "v1.0",
        },
      });

      toast.success("User Added!");
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

  function handleShowPasswordReset(user) {
    setResetUser(user);
    setResetPassword("");
    setResetPasswordConfirm("");
  }

  return (
    <div className={`grid h-full grid-cols-1 md:grid-cols-3 p-4 bg-surface`}>
      <div className="flex flex-col items-center w-full">
        {/* <h1 className="text-2xl font-bold mb-4">Settings</h1> */}
        <div className="bg-white w-full md:w-3/4 p-4 gap-4 rounded-2xl flex flex-col justify-center items-center mb-10 mt-10">
          <h3>Account Info</h3>
          <p>
            Organization -{" "}
            {orgName === null ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              orgName
            )}
          </p>

          <p>Username - {currentUser.display_username}</p>
          <p>Role - {currentUser.role}</p>
          {currentUser.role === "admin" && (
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Change Password
            </Link>
          )}
        </div>
        <div className="bg-white p-4 w-full md:w-3/4 gap-4 rounded-2xl flex flex-col justify-center items-center mb-10">
          <h3>User Agreement</h3>
          <Link to="/terms" className="text-blue-600 hover:underline text-sm">
            Terms and Conditions
          </Link>
          <Link to="/privacy" className="text-blue-600 hover:underline text-sm">
            Privacy Policy
          </Link>
        </div>
        <div className="bg-white p-4 w-full md:w-3/4 gap-4 rounded-2xl flex flex-col justify-center items-center">
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
      <div>
        {" "}
        {currentUser.role === "admin" && (
          <div className="bg-white p-4 mt-10 w-full md:w-full gap-4 rounded-2xl flex flex-col items-center">
            <h3 className="font-bold mb-2">Organization Users</h3>
            <ul className="w-full mb-4">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex justify-between items-center border-b py-1"
                >
                  <span>
                    {u.display_username} <b>{u.role}</b>
                    {u.id === currentUser.id && " (Current User)"}
                  </span>
                  {u.id !== currentUser.id && (
                    <div className="flex gap-2">
                      <button
                        className="text-red-500 text-xs hover:underline"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Delete user "${u.username}"? This cannot be undone.`
                            )
                          ) {
                            try {
                              await pb.collection("users").delete(u.id);
                              toast.success("User deleted");
                              setUsers(
                                users.filter((user) => user.id !== u.id)
                              );
                            } catch (err) {
                              toast.error("Failed to delete user.");
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="text-blue-500 text-xs hover:underline"
                        onClick={() => handleShowPasswordReset(u)}
                      >
                        Reset Password
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowAddUser((s) => !s)}
              className={`text-blue-600 underline ${
                subuserCount >= SUBUSER_LIMIT
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={subuserCount >= SUBUSER_LIMIT}
            >
              {showAddUser ? "Cancel" : "Add New User"}
            </button>
            {subuserCount >= SUBUSER_LIMIT && (
              <p className="text-red-500 mt-2 text-sm">
                Subuser limit reached (max {SUBUSER_LIMIT} per organization).
                Please remove a user before adding another.
              </p>
            )}
            {showAddUser && (
              <form
                onSubmit={handleAddUser}
                className="flex flex-col gap-2 w-full mt-2"
              >
                <input
                  className="border p-2 rounded"
                  type="text"
                  placeholder="Username"
                  value={newUser.username.toLowerCase()}
                  onChange={(e) =>
                    setNewUser((u) => ({ ...u, username: e.target.value }))
                  }
                  required
                />
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
                    setNewUser((u) => ({
                      ...u,
                      passwordConfirm: e.target.value,
                    }))
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
                  <option value="super-user">Super User</option>
                  <option value="staff">Staff</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  type="button"
                  className="text-blue-600 underline text-xs"
                  onClick={() => setShowRoleInfo(true)}
                >
                  What do these roles mean?
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  type="submit"
                >
                  Add User
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center md:pt-0 pt-10">
        <h3 className="text-lg font-bold mb-4 ">Week Headings</h3>
        <div className="w-full md:w-3/4 p-4 flex justify-center bg-white rounded-2xl">
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
            {(currentUser.role === "admin" ||
              currentUser.role === "super-user") && (
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded "
              >
                {!save ? "Save Settings" : "Saving..."}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ------------------------Reset Password Modal------------------------------------------ */}
      {resetUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-xs">
            <h3 className="text-lg mb-2 font-bold">
              Reset password for {resetUser.username}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (resetPassword !== resetPasswordConfirm) {
                  toast.error("Passwords do not match");
                  return;
                }
                try {
                  await pb.collection("users").update(resetUser.id, {
                    password: resetPassword,
                    passwordConfirm: resetPasswordConfirm,
                  });
                  toast.success("Password updated!");
                  setResetUser(null);
                } catch (err) {
                  toast.error(
                    err?.data?.password?.message ||
                      err?.message ||
                      "Failed to update password."
                  );

                  console.error("Error details:", err.data || err.message, err);
                }
              }}
              className="flex flex-col gap-2"
            >
              <input
                className="border p-2 rounded"
                type="password"
                placeholder="New password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                required
              />
              <input
                className="border p-2 rounded"
                type="password"
                placeholder="Confirm new password"
                value={resetPasswordConfirm}
                onChange={(e) => setResetPasswordConfirm(e.target.value)}
                required
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  className="bg-gray-200 px-3 py-1 rounded"
                  onClick={() => setResetUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------Roles Modal--------------------------------------------------- */}
      {showRoleInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full relative">
            <h3 className="text-lg font-bold mb-2">User Roles & Permissions</h3>
            <ul className="text-sm space-y-2 mb-4">
              <li>
                <b>Admin:</b> Full control. Manage everything: users, orders,
                settings and reports.
              </li>
              <li>
                <b>Super User:</b> Create, update, and delete orders. Edit
                reports. No access to user or organization settings.
              </li>
              <li>
                <b>Staff:</b> Create and update orders only. No deleting or
                admin access.
              </li>
              <li>
                <b>Viewer:</b> View-only access to orders.
              </li>
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowRoleInfo(false)}
              aria-label="Close"
            >
              ×
            </button>
            <button
              className="bg-green-600 text-white px-3 py-1 rounded mt-2 w-full"
              onClick={() => setShowRoleInfo(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
