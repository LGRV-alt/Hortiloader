import { create } from "zustand";
import pb from "../api/pbConnect";

const SETTINGS_KEY = "user_settings_cache";

export const useSettingsStore = create((set, get) => ({
  settings: null,
  loading: false,
  async fetchSettings() {
    set({ loading: true });
    // Try localStorage first
    const cached = localStorage.getItem(SETTINGS_KEY);
    if (cached) {
      try {
        set({ settings: JSON.parse(cached), loading: false });
      } catch {
        localStorage.removeItem(SETTINGS_KEY);
      }
    }
    if (pb.authStore.isValid) {
      try {
        const user = pb.authStore.record;
        const records = await pb.collection("user_settings").getFullList({
          filter: `organization="${user.organization}"`,
        });
        let record =
          records[0] ||
          (await pb.collection("user_settings").create({
            user: user.id,
            settings_json: {},
            organization: user.organization,
          }));
        const freshSettings = { ...record.settings_json };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(freshSettings));
        set({ settings: freshSettings, loading: false });
      } catch (err) {
        set({ loading: false });
        console.error("Failed to fetch settings", err);
      }
    }
  },
  async updateSettings(newSettings) {
    if (!pb.authStore.isValid) return;
    const user = pb.authStore.record;
    const records = await pb.collection("user_settings").getFullList({
      filter: `organization="${user.organization}"`,
    });
    if (!records.length) return;
    const updated = await pb.collection("user_settings").update(records[0].id, {
      settings_json: newSettings,
    });
    const freshSettings = { ...updated.settings_json };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(freshSettings));
    set({ settings: freshSettings });
  },
}));
