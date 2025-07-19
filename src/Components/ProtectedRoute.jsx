// src/Components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import pb from "../api/pbConnect";

const REQUIRED_TERMS_VERSION = "v1.0"; // match your latest terms version

export default function ProtectedRoute({ roles, children }) {
  const user = pb.authStore.record;

  if (!pb.authStore.isValid) {
    return <Navigate to="/" />;
  }

  // Only force verification for admin users!
  if (user?.role === "admin" && !user?.verified) {
    return <Navigate to="/resend-verification" />;
  }

  if (
    !user?.termsAgreement ||
    user.termsAgreement.version !== REQUIRED_TERMS_VERSION
  ) {
    return <Navigate to="/accept-terms" />;
  }

  // Role-based protection
  // roles can be a string or array
  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" />; // or a 404, etc.
    }
  }

  return children;
}
