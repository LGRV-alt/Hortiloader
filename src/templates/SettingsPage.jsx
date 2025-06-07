import React, { useState, useEffect } from "react";
import { useUserSettings } from "../hooks/useUserSettings";

export default function SettingsPage() {
  const { settings, updateSettings, loading } = useUserSettings();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  if (loading) return <div className="p-4">Loading settings...</div>;
  if (!settings) return <div className="p-4">No settings found.</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["monday", "tuesday", "wednesday"].map((day) => (
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
