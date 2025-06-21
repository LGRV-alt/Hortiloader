import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-sm text-gray-800">
      <div className="flex gap-1">
        <Link className="text-blue-500 text-lg pb-12" to="/">
          {" "}
          Home
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Use of the Service</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>You must be at least 16 years old to create an account.</li>
          <li>You agree to provide accurate and complete information.</li>
          <li>You are responsible for safeguarding your login credentials.</li>
          <li>
            You must not use the Service for unlawful or harmful purposes.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. User Accounts and Data
        </h2>
        <p>
          By creating an account, you consent to the storage of your data (e.g.,
          profile information, form entries) in our backend, powered by{" "}
          <strong>PocketBase</strong>.
        </p>
        <p>
          We do not share your data with third parties unless legally required.
        </p>
        <p>
          You may delete your account by contacting support (see section 10).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Terms Agreement Tracking
        </h2>
        <p>
          By creating an account, you confirm that you agree to these Terms and
          our{" "}
          <a href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </a>
          .
        </p>
        <p>Your agreement is recorded with a timestamp in our system.</p>
        <p>
          We may ask you to re-confirm your agreement if these Terms are
          updated.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Data Storage and Security
        </h2>
        <p>
          Data is stored securely in PocketBase, hosted in an encrypted
          environment.
        </p>
        <p>
          We recommend using a strong password and keeping your device secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Availability and Reliability
        </h2>
        <p>
          The Service is provided “as is” without warranties of any kind. We do
          not guarantee uninterrupted access.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Premium Features (Future)
        </h2>
        <p>
          We may offer optional paid features in the future via a secure
          provider.
        </p>
        <p>
          Details on plans and refund policies will be provided before any
          purchase.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Disclaimer</h2>
        <p>
          This Service is not intended to offer legal, financial, medical, or
          professional advice. Use at your own discretion.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
        <p>
          We may suspend or delete accounts that violate these Terms. You may
          request deletion at any time.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
        <p>
          We may update these Terms. Continued use signifies acceptance of
          updates.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
        <p>
          Please contact us at{" "}
          <span>
            <a
              href="mailto:support@yourdomain.com"
              className="text-blue-600 underline"
            >
              support@hortiloader.com
            </a>
          </span>{" "}
          to have your account deleted.
        </p>
        {/* <p>Company: Your Company Name</p>
        <p>Registered in the United Kingdom</p> */}
      </section>
    </div>
  );
}
