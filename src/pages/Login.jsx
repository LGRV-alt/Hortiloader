import { useState } from "react";
import { login, signup } from "../api/pocketbase";
import LogoTree from "../Components/svg/LogoTree";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import HortiLoaderWordmark from "../Components/svg/HortiLoaderWordmark";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [toggle, setToggle] = useState(true);
  const [loginStatus, setLoginStatus] = useState("Sign In");
  const [signUpStatus, setSignUpStatus] = useState("Sign up");
  const [agreed, setAgreed] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [loginOrgName, setLoginOrgName] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const normUsername = `${normalizeInput(loginOrgName)}-${normalizeInput(
      username,
    )}`;
    const normOrg = normalizeInput(loginOrgName);

    if (!username || !password || !loginOrgName) {
      toast.error("Please enter both username and password");
      return;
    }

    setLoginStatus("Logging In...");
    const result = await login(normUsername, password, normOrg);
    setLoginStatus("Sign In");

    if (!result.success) {
      toast.error(result.message);

      // If they haven’t accepted terms before (older account)
      if (result.reason === "no_terms") {
        navigate("/accept-terms");
      }

      return;
    }

    //Fully authenticated
    toast.success("Login successful!");
    navigate("/");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const normUsername = `${normalizeInput(orgName)}-${normalizeInput(
      username,
    )}`;
    const normOrg = normalizeInput(orgName);
    const display_username = normalizeInput(username);
    if (!username || !password || !email || !orgName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreed) {
      toast.error("You must agree to the Terms and Privacy Policy.");
      return;
    }

    setSignUpStatus("Creating...");
    const result = await signup(
      normUsername,
      password,
      email,
      {
        agreed: true,
        timestamp: new Date().toISOString(),
        version: "v1.1",
      },
      normOrg,
      display_username,
    );

    if (!result.success) {
      toast.error(result.message);
      setSignUpStatus("Sign up");
      return;
    }

    toast.success("Account created! Check your email to verify.");
    setToggle(true);
    setSignUpStatus("Sign up");
    setUsername("");
    setPassword("");
    setEmail("");
    setConfirmPassword("");
  };

  const handleToggle = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setConfirmPassword("");
    setToggle(!toggle);
  };

  function normalizeInput(str) {
    return str
      ? str
          .trim()
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, "-")
      : "";
  }

  return (
    <div className="dark:bg-darkMain md:bg-white bg-regal-blue grid grid-cols-1 grid-rows-[1fr_5fr] md:grid-rows-1  md:grid-cols-2 h-screen">
      <div className="flex flex-col md:justify-center pt-5 pb-5 items-center">
        {toggle ? (
          <form
            onSubmit={handleLogin}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white p-8 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/30 w-96  md:mt-0"
          >
            <h2 className="text-2xl text-center font-semibold mb-6">Welcome</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Organization Name
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white px-3 py-2 text-base font-medium outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  value={loginOrgName}
                  onChange={(e) => setLoginOrgName(e.target.value)}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Username
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white px-3 py-2 text-base font-medium outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Password
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white px-3 py-2 text-base font-medium outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={loginStatus !== "Sign In"}
              className="w-full mt-6 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginStatus}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleToggle}
                className="text-blue-600 dark:text-blue-400 underline text-sm"
              >
                Create an account
              </button>
              <div className="mt-2">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSignup}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white p-8 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/30 w-96  md:mt-0"
          >
            <h2 className="text-2xl text-center font-semibold mb-6">Sign up</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Organization Name
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white px-3 py-2 text-base font-medium outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Email
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white px-3 py-2 text-base font-medium outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Username
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white px-3 py-2 text-base font-medium outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Password
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white px-3 py-2 text-base font-medium outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Confirm Password
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white px-3 py-2 text-base font-medium outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={signUpStatus !== "Sign up"}
              className="w-full mt-6 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signUpStatus}
            </button>
            <label className="flex items-start gap-2 text-sm mt-4 text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-green-600"
                required
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleToggle}
                className="text-blue-600 dark:text-blue-400 underline text-sm"
              >
                Continue to log in
              </button>
            </div>
          </form>
        )}
      </div>

      <div className=" md:flex row-start-1 md:col-start-2 bg-regal-blue items-center justify-center pt-5 md:pt-0">
        <div className="flex flex-col items-center">
          <div className="hidden md:flex">
            {" "}
            <LogoTree height="200px" />
          </div>
          <Link to={"/"}>
            <HortiLoaderWordmark height="50px" />
          </Link>
          <p className="text-lg text-white">create and track orders</p>
        </div>
      </div>
    </div>
  );
}
