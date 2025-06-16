import { useState } from "react";
import { login, signup } from "./Components/lib/pocketbase";
import LogoTree from "./Components/LogoTree";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [toggle, setToggle] = useState(true);
  const [loginStatus, setLoginStatus] = useState("Sign In");
  const [signUpStatus, setSignUpStatus] = useState("Sign up");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setLoginStatus("Logging In...");
    const result = await login(username, password);
    setLoginStatus("Sign In");

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Login successful!");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSignUpStatus("Creating...");
    const result = await signup(username, password, email);

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
              <label className="block text-sm">
                Username
                <input
                  type="text"
                  className="w-full border-b-2 outline-none focus:border-green-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="block text-sm">
                Password
                <input
                  type="password"
                  className="w-full border-b-2 outline-none focus:border-green-600"
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
            className="bg-white p-6 rounded shadow-md w-80"
          >
            <h2 className="text-2xl font-semibold mb-6">Sign up</h2>
            <div className="space-y-4">
              <label className="block text-sm">
                Email
                <input
                  type="email"
                  className="w-full border-b-2 outline-none focus:border-green-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              <label className="block text-sm">
                Username
                <input
                  type="text"
                  className="w-full border-b-2 outline-none focus:border-green-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="block text-sm">
                Password
                <input
                  type="password"
                  className="w-full border-b-2 outline-none focus:border-green-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="block text-sm">
                Confirm Password
                <input
                  type="password"
                  className="w-full border-b-2 outline-none focus:border-green-600"
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
          <p className="text-lg text-white">Create and track orders</p>
        </div>
      </div>
    </div>
  );
}
