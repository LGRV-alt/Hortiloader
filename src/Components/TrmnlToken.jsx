import { useState } from "react";
import pb from "../api/pbConnect";

export default function TrmnlToken() {
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = pb.authStore.token;

  const handleShow = () => {
    if (!token) {
      alert("You're not logged in! Please log in first.");
      return;
    }
    setShowToken(true);
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 bg-gray-900 rounded-2xl border border-gray-700 max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-white">TRMNL Integration</h2>

      <p className="text-gray-300 mb-6">
        Use your current login token to connect this account's data to TRMNL.
        It's already limited to your own organization/data.
      </p>

      {!showToken ? (
        <button
          onClick={handleShow}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium"
        >
          Reveal My Token
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-950 p-5 rounded-xl font-mono text-green-300 break-all text-sm">
            {token}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={copyToken}
              className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium"
            >
              {copied ? "Copied!" : "Copy Token"}
            </button>

            <button
              onClick={() => setShowToken(false)}
              className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-medium"
            >
              Hide
            </button>
          </div>

          <p className="text-amber-400 text-sm mt-4">
            ⚠️ Keep this token private! If it ever gets compromised, change your
            password to invalidate it.
          </p>
        </div>
      )}
    </div>
  );
}
