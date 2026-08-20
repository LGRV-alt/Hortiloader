import { useCallback, useEffect, useState } from "react";
import pb from "../api/pbConnect";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const EMPTY_STATE = {
  status: null,
  trialEnds: null,
  graceEnds: null,
  daysLeftInTrial: null,
  uiState: "clear",
};

// Billing is per-organization - trial_ends/grace_ends/subscription_status
// live on the organization record (see signup() in src/api/pocketbase.js
// for where they get set, and the PocketBase admin UI for how they get
// changed afterwards; there's no server-side code anywhere in this
// feature, so nothing keeps this in sync with Stripe automatically).
function computeUiState(org) {
  if (!org) return EMPTY_STATE;

  const status = org.subscription_status;
  const trialEnds = org.trial_ends ? new Date(org.trial_ends) : null;
  const graceEnds = org.grace_ends ? new Date(org.grace_ends) : null;
  const now = new Date();

  let uiState;
  if (status === "active" || status === "comped") {
    uiState = "clear";
  } else if (status === "pending") {
    uiState = "pending";
  } else if (!graceEnds || now > graceEnds) {
    uiState = "blocked";
  } else if (trialEnds && now <= trialEnds) {
    uiState = "trial";
  } else {
    uiState = "grace";
  }

  const daysLeftInTrial =
    uiState === "trial" && trialEnds
      ? Math.max(0, Math.ceil((trialEnds.getTime() - now.getTime()) / MS_PER_DAY))
      : null;

  return { status, trialEnds, graceEnds, daysLeftInTrial, uiState };
}

export default function useSubscriptionStatus() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const orgId = pb.authStore.record?.organization;
    if (!pb.authStore.isValid || !orgId) {
      setOrg(null);
      setLoading(false);
      return;
    }
    try {
      const record = await pb.collection("organization").getOne(orgId);
      setOrg(record);
    } catch (err) {
      console.error("Failed to load organization billing status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsub = pb.authStore.onChange(() => {
      setLoading(true);
      refresh();
    });
    return () => unsub();
  }, [refresh]);

  return { ...computeUiState(org), loading, refresh };
}
