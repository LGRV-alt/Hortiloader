import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import pb from "../Components/lib/pbConnect";

export default function AcceptTerms() {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = pb.authStore.model;
    if (pb.authStore.isValid && user?.termsAgreement?.version === "v1.0") {
      navigate("/");
    }
  }, []);

  const handleAgree = async () => {
    if (!agreed) {
      toast.error("You must agree to the terms to continue.");
      return;
    }

    try {
      setSubmitting(true);
      const userId = pb.authStore.model?.id;

      if (!userId) {
        toast.error("User not authenticated.");
        return;
      }

      await pb.collection("users").update(userId, {
        termsAgreement: {
          agreed: true,
          timestamp: new Date().toISOString(),
          version: "v1.0",
        },
      });

      toast.success("Terms accepted. Redirecting...");
      navigate("/"); // or wherever you want to send them
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Accept Terms & Policies
      </h2>
      <p className="mb-4 text-gray-700">
        Please review and accept our{" "}
        <Link
          className="text-blue-600 underline"
          to="/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link
          className="text-blue-600 underline"
          to="/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy{" "}
        </Link>
        before continuing.
      </p>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          I have read and agree to the Terms and Conditions and Privacy Policy.
        </span>
      </label>

      <button
        onClick={handleAgree}
        disabled={!agreed || submitting}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Agree and Continue"}
      </button>
    </div>
  );
}
