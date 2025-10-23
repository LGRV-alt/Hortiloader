import { useState } from "react";
import { login, signup } from "../api/pocketbase";
import LogoTree from "../Components/svg/LogoTree";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";

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
      username
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
      username
    )}`;
    const normOrg = normalizeInput(orgName);
    const display_username = normalizeInput(username);
    if (!username || !password || !email) {
      toast.error("Please fill in all fields");
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
        version: "v1.0",
      },
      normOrg,
      display_username
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
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, "-")
      : "";
  }

  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_5fr] md:grid-rows-1  md:grid-cols-2 h-screen">
      <div className="flex flex-col mt-10 md:justify-center items-center">
        {toggle ? (
          <form
            onSubmit={handleLogin}
            className="bg-white p-6 rounded shadow-xl w-80"
          >
            <h2 className="text-2xl text-center font-semibold mb-6">Welcome</h2>
            <div className="space-y-4">
              <label className="block text-sm font-light">
                Organization Name
                <input
                  type="text"
                  className="text-lg font-medium w-full border-b-2 outline-none focus:border-green-600"
                  value={loginOrgName}
                  onChange={(e) => setLoginOrgName(e.target.value)}
                  required
                />
              </label>

              <label className="block text-sm font-light">
                Username
                <input
                  type="text"
                  className="text-lg font-medium w-full border-b-2 outline-none focus:border-green-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="font-thin block text-sm">
                Password
                <input
                  type="password"
                  className="text-lg w-full border-b-2 outline-none focus:border-green-600"
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
              className="w-full mt-6 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loginStatus}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleToggle}
                className="text-blue-600 underline text-sm"
              >
                Create an account
              </button>
              <div className="mt-2">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Forgot your password?
                </Link>
                <br />
                <Link
                  to="/resend-verification"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Didn't get a verification email?
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSignup}
            className="bg-white p-6 rounded shadow-xl w-80"
          >
            <h2 className="text-2xl text-center font-semibold mb-6">Sign up</h2>
            <div className="space-y-4">
              <label className="block text-sm font-thin">
                Organization Name
                <input
                  type="text"
                  className="font-medium text-lg w-full border-b-2 outline-none focus:border-green-600"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-thin">
                Email
                <input
                  type="email"
                  className="font-medium text-lg w-full border-b-2 outline-none focus:border-green-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              <label className="font-thin block text-sm">
                Username
                <input
                  type="text"
                  className="font-medium text-lg w-full border-b-2 outline-none focus:border-green-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="font-thin block text-sm">
                Password
                <input
                  type="password"
                  className="text-lg w-full border-b-2 outline-none focus:border-green-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="font-thin block text-sm">
                Confirm Password
                <input
                  type="password"
                  className="text-lg w-full border-b-2 outline-none focus:border-green-600"
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
              className="w-full mt-6 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {signUpStatus}
            </button>
            <label className="flex items-start gap-2 text-sm mt-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleToggle}
                className="text-blue-600 underline text-sm"
              >
                Continue to log in
              </button>
            </div>
          </form>
        )}
      </div>

      <div className=" md:flex row-start-1 md:col-start-2 bg-regal-blue items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="hidden md:flex">
            {" "}
            <LogoTree height="200px" />
          </div>
          <h2 className="text-5xl font-display text-white mt-4">HortiLoader</h2>
          <p className="text-lg text-white">create and track orders</p>
        </div>
      </div>
    </div>
  );
}
