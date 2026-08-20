import useSubscriptionStatus from "../hooks/useSubscriptionStatus";
import SubscribeRequired from "../pages/SubscribeRequired";

// Wraps the authenticated app shell. Blocks app access once the org's
// grace period has ended and it's not active/comped/pending - see
// useSubscriptionStatus for the underlying rule.
export default function SubscriptionGate({ children }) {
  const { uiState, loading } = useSubscriptionStatus();

  if (loading) {
    return null;
  }

  if (uiState === "blocked") {
    return <SubscribeRequired />;
  }

  return children;
}
