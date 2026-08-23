import useSubscriptionStatus from "../hooks/useSubscriptionStatus";

const SHOW_FROM_DAYS_LEFT = 7;

export default function TrialIndicator() {
  const { uiState, daysLeftInTrial } = useSubscriptionStatus();

  if (uiState !== "trial" || daysLeftInTrial > SHOW_FROM_DAYS_LEFT) return null;

  return (
    <span className="text-xs bg-white/10 rounded-full px-3 py-1 whitespace-nowrap">
      {daysLeftInTrial} {daysLeftInTrial === 1 ? "day" : "days"} left in trial
    </span>
  );
}
