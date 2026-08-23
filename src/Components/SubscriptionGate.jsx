import { useEffect, useState } from "react";
import useSubscriptionStatus from "../hooks/useSubscriptionStatus";
import SubscribeRequired from "../pages/SubscribeRequired";
import DanishTrolleyLoader from "./DanishTrolleyLoader";

// Once the spinner appears, keep it up for at least this long so a fast
// org-status fetch doesn't just flash the screen for a moment.
const MIN_LOADING_MS = 2000;

// Wraps the authenticated app shell. Blocks app access once the org's
// grace period has ended and it's not active/comped/pending - see
// useSubscriptionStatus for the underlying rule.
export default function SubscriptionGate({ children }) {
  const { uiState, loading } = useSubscriptionStatus();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Starts once, when this component first mounts (i.e. right when the
  // user becomes authenticated) - runs to completion on its own timeline
  // regardless of when the actual fetch finishes, so a fast resolve can't
  // cut it short.
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !minTimeElapsed) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col justify-center bg-white dark:bg-darkMain gap-4"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="flex justify-center items-center flex-col">
          <p className="dark:text-slate-300 text-slate-600 text-lg font-bold ">
            Gathering your orders...
          </p>
        </div>
        <div className="">
          <DanishTrolleyLoader />
        </div>
      </div>
    );
  }

  if (uiState === "blocked") {
    return <SubscribeRequired />;
  }

  return children;
}
