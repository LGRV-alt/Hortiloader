import useSubscriptionStatus from "../hooks/useSubscriptionStatus";

export default function TrialIndicator() {
  const { uiState, daysLeftInTrial } = useSubscriptionStatus();

  if (uiState !== "trial") return null;

  return (
    <span className="text-xs bg-white/10 rounded-full px-3 py-1 whitespace-nowrap">
      {daysLeftInTrial} {daysLeftInTrial === 1 ? "day" : "days"} left in trial
    </span>
  );
}
