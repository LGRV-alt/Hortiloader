import { useState, useEffect } from "react";
import pb from "../api/pbConnect";

const SETTINGS_KEY = "user_settings_cache";

export function useUserSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);

    // Try loading from localStorage
    const cached = localStorage.getItem(SETTINGS_KEY);
    if (cached) {
      try {
        setSettings(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        localStorage.removeItem(SETTINGS_KEY);
      }
    }

    // Then fetch from PocketBase if logged in
    if (pb.authStore.isValid) {
      try {
        const user = pb.authStore.record;
        const userId = user.id;
        const records = await pb.collection("user_settings").getFullList({
          filter: `organization="${user.organization}"`,
        });

        let record;
        if (records.length > 0) {
          record = records[0];
        } else {
          record = await pb.collection("user_settings").create({
            user: userId,
            settings_json: {},
            organization: user.organization,
          });
        }

        const freshSettings = { ...record.settings_json }; // clone for reactivity
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(freshSettings));
        setSettings(freshSettings);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    }

    setLoading(false);
  };

  const updateSettings = async (newSettings) => {
    if (!pb.authStore.isValid) return;

    const user = pb.authStore.record;
    const records = await pb.collection("user_settings").getFullList({
      filter: `organization="${user.organization}"`,
    });

    if (!records.length) return;

    const updated = await pb.collection("user_settings").update(records[0].id, {
      settings_json: newSettings,
    });

    const freshSettings = { ...updated.settings_json }; // clone again
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(freshSettings));
    setSettings(freshSettings);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    updateSettings,
    fetchSettings,
    loading,
  };
}
