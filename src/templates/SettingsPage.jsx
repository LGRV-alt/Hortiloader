import React, { useState, useEffect } from "react";
import { useUserSettings } from "../hooks/useUserSettings";

export default function SettingsPage() {
  const { settings, updateSettings, fetchSettings, loading } =
    useUserSettings(); // include fetchSettings
  const [form, setForm] = useState({});

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

    await updateSettings(form); // update backend + localStorage
    await fetchSettings(); // now reload the latest data into state (triggers re-render)
    window.location.reload(); // ← force full page refresh
  };

  if (loading) return <div className="p-4">Loading settings...</div>;
  if (!settings) return <div className="p-4">No settings found.</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block font-medium capitalize mb-1">
              {day} Heading
            </label>
            <input
              type="text"
              name={`${day}_heading`}
              value={form[`${day}_heading`] || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
