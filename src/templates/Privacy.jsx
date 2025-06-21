import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <div className="flex gap-1">
        <Link className="text-blue-500 text-lg pb-12" to="/">
          {" "}
          Home
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated 2025-06-21</p>

      <section className="mb-8">
        <p>
          Welcome to <strong>HortiLoader</strong>. This Privacy Policy explains
          how we collect, use, and protect your information when you use our web
          application ("the App"). The App allows users to manage orders, tasks
          and customer-related information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>User-Provided Content:</strong> Task data, order details,
            customer names, postcodes, load information and other notes you
            manually enter into the App.
          </li>
          <li>
            <strong>Account Information:</strong> Username, email address, and
            password (stored securely using PocketBase's authentication).
          </li>
          <li>
            <strong>Device/Usage Data:</strong> Minimal usage analytics to
            ensure App stability and improve performance (no tracking of IP
            addresses).
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Allow you to securely access and use the App</li>
          <li>Store and organize your submitted data (tasks, orders, etc.)</li>
          <li>Maintain and improve the functionality of the App</li>
          <li>Respond to support queries and feedback</li>
          <li>Notify you about important account or service updates</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Data Storage & Security
        </h2>
        <p>
          Your data is stored securely in our backend powered by PocketBase. We
          use modern encryption and access control practices to ensure that your
          information is protected against unauthorized access or loss.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Sharing of Information
        </h2>
        <p>
          We do <strong>not</strong> sell, rent or trade your information. We
          only share data if required to:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Comply with legal obligations</li>
          <li>
            Provide services via trusted third-party infrastructure (e.g.,
            hosting)
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Access and view your stored data</li>
          <li>Request updates or corrections to your data</li>
          <li>Delete your account and all associated data</li>
        </ul>
        <p className="mt-2">
          To exercise your rights, contact us at{" "}
          <a
            href="mailto:support@hortiloader.com"
            className="text-blue-600 underline"
          >
            support@hortiloader.com
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
        <p>
          We retain your data for as long as your account is active. You may
          delete your data at any time by contacting us. After account deletion,
          data is permanently removed from our systems.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy occasionally. All changes will be
          posted within the App, and your continued use of the App implies
          acceptance of the updated terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
        <p>
          If you have questions about this Privacy Policy, please email us at{" "}
          <a
            href="mailto:support@hortiloader.com"
            className="text-blue-600 underline"
          >
            support@hortiloader.com
          </a>
          .
        </p>
      </section>

      <p className="mt-10 text-center text-sm text-gray-400">
        Thank you for trusting HortiLoader.
      </p>
    </div>
  );
}
