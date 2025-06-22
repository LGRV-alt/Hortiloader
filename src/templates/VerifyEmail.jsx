import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pb from "../Components/lib/pbConnect";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    async function verify() {
      try {
        await pb.collection("users").confirmVerification(token);
        setStatus("Email verified! You can now log in.");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error(err);
        setStatus("Verification failed or token expired.");
      }
    }
    verify();
  }, [token]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold">{status}</h2>
    </div>
  );
}
