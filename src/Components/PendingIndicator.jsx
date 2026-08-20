import useSubscriptionStatus from "../hooks/useSubscriptionStatus";

export default function PendingIndicator() {
  const { uiState } = useSubscriptionStatus();

  if (uiState !== "pending") return null;

  return (
    <span className="text-xs bg-white/10 rounded-full px-3 py-1 whitespace-nowrap">
      Payment being confirmed
    </span>
  );
}
