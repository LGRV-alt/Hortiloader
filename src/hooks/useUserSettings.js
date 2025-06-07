import { useState, useEffect } from "react";
import pb from "../Components/lib/pbConnect";

const SETTINGS_KEY = "user_settings_cache";

export function useUserSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    // Try localStorage first
    const cached = localStorage.getItem(SETTINGS_KEY);
    if (cached) {
      try {
        setSettings(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        localStorage.removeItem(SETTINGS_KEY);
      }
    }

    // Fetch from PocketBase
    if (pb.authStore.isValid) {
      try {
        const records = await pb.collection("user_settings").getFullList({
          filter: `user="${pb.authStore.model.id}"`,
        });

        let record;
        if (records.length > 0) {
          record = records[0];
        } else {
          // Create default if none exists
          record = await pb.collection("user_settings").create({
            user: pb.authStore.model.id,
            settings_json: {},
          });
        }

        localStorage.setItem(
          SETTINGS_KEY,
          JSON.stringify(record.settings_json)
        );
        setSettings(record.settings_json);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    }

    setLoading(false);
  };

  const updateSettings = async (newSettings) => {
    if (!pb.authStore.isValid) return;

    const userId = pb.authStore.model.id;
    const records = await pb.collection("user_settings").getFullList({
      filter: `user="${userId}"`,
    });

    if (!records.length) return;

    const updated = await pb.collection("user_settings").update(records[0].id, {
      settings_json: newSettings,
    });

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated.settings_json));
    setSettings(updated.settings_json);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, updateSettings, loading };
}
