// src/Components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import pb from "./lib/pbConnect";

const REQUIRED_TERMS_VERSION = "v1.0"; // match your latest terms version

export default function ProtectedRoute({ children }) {
  const user = pb.authStore.model;

  if (!pb.authStore.isValid) {
    return <Navigate to="/login" />;
  }

  if (!user?.verified) {
    return <Navigate to="/resend-verification" />;
  }

  if (
    !user?.termsAgreement ||
    user.termsAgreement.version !== REQUIRED_TERMS_VERSION
  ) {
    return <Navigate to="/accept-terms" />;
  }

  return children;
}
