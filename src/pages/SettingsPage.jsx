import { useState, useEffect } from "react";
import { useUserSettings } from "../hooks/useUserSettings";
import pb from "../api/pbConnect";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function SettingsPage({ onSettingsChange }) {
  const { settings, updateSettings, fetchSettings } = useUserSettings(); // include fetchSettings
  const [form, setForm] = useState({});
  const [save, setSave] = useState(false);

  const currentUser = pb.authStore.model;

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

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

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-2 p-4 bg-surface">
      <div className="flex flex-col items-center">
        {/* <h1 className="text-2xl font-bold mb-4">Settings</h1> */}
        <div className="bg-white w-1/2 p-4 gap-4 rounded-2xl flex flex-col justify-center items-center mb-10 mt-10">
          <h3>Account Info</h3>
          <p>Username - {currentUser.username}</p>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Change Password
          </Link>
        </div>
        <div className="bg-white p-4 w-1/2 gap-4 rounded-2xl flex flex-col justify-center items-center mb-10">
          <h3>User Agreement</h3>
          <Link to="/terms" className="text-blue-600 hover:underline text-sm">
            Terms and Conditions
          </Link>
          <Link to="/privacy" className="text-blue-600 hover:underline text-sm">
            Privacy Policy
          </Link>
        </div>
        <div className="bg-white p-4 w-1/2 gap-4 rounded-2xl flex flex-col justify-center items-center">
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
        <div className="w-1/2 p-4 bg-white rounded-2xl">
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
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {!save ? "Save Settings" : "Saving..."}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
