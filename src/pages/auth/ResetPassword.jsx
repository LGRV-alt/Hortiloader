import { useState } from "react";
import { useParams } from "react-router-dom";
import pb from "../../api/pbConnect";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = async () => {
    try {
      await pb
        .collection("users")
        .confirmPasswordReset(token, password, confirm);
      alert("Password reset successful");
    } catch (err) {
      alert("Reset failed");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <input
        className="mb-2 p-2 border w-full"
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="mb-4 p-2 border w-full"
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Reset
      </button>
    </div>
  );
}
