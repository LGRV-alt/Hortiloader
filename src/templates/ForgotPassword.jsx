import { useState } from "react";
import pb from "../Components/lib/pbConnect";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetRequest = async () => {
    try {
      await pb.collection("users").requestPasswordReset(email);
      toast.success("Password reset email sent!");
      navigate("/");
    } catch (error) {
      toast.error("Error sending reset email.");
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-main shadow flex flex-col justify-center items-center">
      <div className="gap-6 w-full h-3/4 md:w-1/3 md:h-2/3 bg-white flex justify-center items-center rounded-3xl ">
        <div className="w-3/4 h-full flex-col flex justify-center text-center ">
          <h2 className="text-xl font-bold mb-14 md:mb-4">Forgot Password</h2>
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
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/")}
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
}
