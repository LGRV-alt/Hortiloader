import useSubscriptionStatus from "../hooks/useSubscriptionStatus";

const PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK;

export default function TrialBanner() {
  const { uiState } = useSubscriptionStatus();

  if (uiState !== "grace") return null;

  return (
    <div className="print:hidden sticky top-0 z-40 bg-amber-500 text-white text-sm px-4 py-2 flex flex-wrap items-center justify-center gap-3 text-center">
      <span>Your trial has ended — subscribe to keep access.</span>
      <a
        href={PAYMENT_LINK || "#"}
        className="bg-white text-amber-700 font-semibold px-3 py-1 rounded hover:bg-amber-50"
      >
        Subscribe
      </a>
    </div>
  );
}
