import { useState } from "react";
import pb from "../Components/lib/pbConnect";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetRequest = async () => {
    try {
      await pb.collection("users").requestPasswordReset(email);
      alert("Password reset email sent!");
      navigate("/login");
    } catch (error) {
      alert("Error sending reset email.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border rounded mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleResetRequest}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send Reset Link
      </button>
    </div>
  );
}
