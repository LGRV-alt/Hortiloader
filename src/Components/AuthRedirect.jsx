import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthRedirect() {
  console.log("AuthRedirect loaded", window.location.hash);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.startsWith("#/auth/confirm-password-reset/")) {
      const token = hash.split("/").pop();
      navigate(`/reset-password?token=${token}`);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="text-center mt-20">
      <p>Redirecting...</p>
    </div>
  );
}
