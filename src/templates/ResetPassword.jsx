import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import pb from "../Components/lib/pbConnect";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!token) {
      alert("Missing token.");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await pb
        .collection("users")
        .confirmPasswordReset(token, password, confirm);
      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Reset failed. Token may be expired or invalid.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        className="w-full p-2 border rounded mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        className="w-full p-2 border rounded mb-4"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Reset Password
      </button>
    </div>
  );
}
