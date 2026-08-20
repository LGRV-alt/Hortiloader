import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pb from "../api/pbConnect";
import HortiLoaderWordmark from "../Components/svg/HortiLoaderWordmark";

// Reached after a successful Stripe Payment Link payment. There's no
// server-side code in this feature, so this page can't actually verify
// the payment - it just marks the org "pending" so the org gets
// provisional access, and the site owner confirms the real payment in
// the Stripe Dashboard afterward and flips subscription_status to
// "active" by hand in the PocketBase admin UI.
export default function SubscribeSuccess() {
  const [state, setState] = useState("working"); // working | done | error | signed-out
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function markPending() {
      if (!pb.authStore.isValid) {
        if (!cancelled) setState("signed-out");
        return;
      }

      const orgId = pb.authStore.record?.organization;
      if (!orgId) {
        if (!cancelled) {
          setState("error");
          setErrorMessage("Couldn't find an organization on your account.");
        }
        return;
      }

      try {
        await pb.collection("organization").update(orgId, {
          subscription_status: "pending",
        });
        if (!cancelled) setState("done");
      } catch (err) {
        console.error("Failed to mark subscription as pending:", err);
        if (!cancelled) {
          setState("error");
          setErrorMessage(
            err?.data?.message ||
              err?.message ||
              "Something went wrong updating your account.",
          );
        }
      }
    }

    markPending();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-6 text-center dark:bg-darkMain dark:text-white bg-slate-50">
      <HortiLoaderWordmark height="40px" />

      {state === "working" && (
        <p className="dark:text-slate-300 text-slate-600">
          Confirming your subscription...
        </p>
      )}

      {state === "done" && (
        <>
          <h1 className="text-2xl font-bold">Thanks!</h1>
          <p className="dark:text-slate-300 text-slate-600 max-w-md">
            Your payment is being confirmed and you’ll have full access
            shortly.
          </p>
          <Link to="/" className="text-blue-600 underline">
            Back to Hortiloader
          </Link>
        </>
      )}

      {state === "signed-out" && (
        <>
          <h1 className="text-2xl font-bold">You’re signed out</h1>
          <p className="dark:text-slate-300 text-slate-600 max-w-md">
            Your payment went through, but we couldn’t update your account
            because you’re not logged in. Log back in and try the link in
            your Stripe receipt again, or contact support.
          </p>
          <Link to="/login" className="text-blue-600 underline">
            Log in
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <h1 className="text-2xl font-bold text-red-600">
            Something went wrong
          </h1>
          <p className="dark:text-slate-300 text-slate-600 max-w-md">
            {errorMessage}
          </p>
          <p className="text-sm dark:text-slate-400 text-slate-500 max-w-md">
            Your payment may still have gone through — contact support if
            this doesn’t get sorted out.
          </p>
          <Link to="/" className="text-blue-600 underline">
            Back to Hortiloader
          </Link>
        </>
      )}
    </div>
  );
}
