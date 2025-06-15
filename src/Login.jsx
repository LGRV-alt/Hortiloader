import { useState } from "react";
import { login, signup } from "./Components/lib/pocketbase";
import LogoTree from "./Components/LogoTree";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [toggle, setToggle] = useState(true);
  const [loginStatus, setLoginStatus] = useState("Sign In");
  const [signUpStatus, setSignUpStatus] = useState("Sign up");

  const handleLogin = async () => {
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

  const handleSignup = async () => {
    if (!username || !password || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    setSignUpStatus("Creating...");

    const result = await signup(username, password, email);

    if (!result.success) {
      toast.error(result.message);
      setSignUpStatus("Sign up");
      return;
    }
    toast.success("User created successfully!");
    toast("Please check your email to verify your account before logging in.");
    setToggle(!toggle);
    setSignUpStatus("Sign up");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleToggle = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setToggle(!toggle);
  };
  return (
    <div className="grid grid-rows-[1fr_10fr] grid-cols-1 md:grid-cols-2 md:grid-rows-1 ">
      {toggle ? (
        <div className=" flex flex-col justify-evenly items-center">
          <div className="bg-white flex flex-col  items-center pt-10  h-full md:justify-center">
            <h2 className="text-2xl  font-semibold  mb-10">Welcome</h2>
            <div className=" grid gap-6 mt-4">
              <div className="w-72">
                <div className=" mb-2 flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">Username</label>
                  <input
                    className=" text-input border-b-2 focus:outline-none focus:border-green-600"
                    placeholder=""
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="w-72 ">
                <div className=" mb-2 flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">Password</label>
                  <input
                    className=" text-input border-b-2 focus:outline-none focus:border-green-600"
                    placeholder="  "
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              // className=" w-1/2 mt-10 bg-green-500 text-white py-2 px-4 rounded-md text-base  hover:bg-green-600 "
              className={`w-1/2 mt-10 bg-green-500 text-white py-2 px-4 rounded-md text-base hover:bg-green-600 ${
                loginStatus !== "Sign In" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleLogin}
            >
              <span className="">{loginStatus}</span>
            </button>
            <button onClick={handleToggle}>Create an account</button>
          </div>{" "}
          <div className="text-sm mt-2 mb-4 text-center">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
            <Link
              to="/resend-verification"
              className="text-blue-600 hover:underline block mt-2"
            >
              Didn’t get a verification email?
            </Link>
          </div>
        </div>
      ) : (
        <div className=" flex flex-col justify-evenly items-center">
          <div className="bg-white flex flex-col  items-center pt-10 h-full md:justify-center">
            <h2 className="text-2xl  font-semibold  mb-10">Sign up</h2>
            <div className="grid gap-6 mt-4">
              <div className="w-72 ">
                <div className=" flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">Email</label>
                  <input
                    className=" text-input border-b-2 focus:outline-none focus:border-green-600"
                    placeholder="  "
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="w-72">
                <div className=" mb-2 flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">Username</label>
                  <input
                    className=" text-input border-b-2 focus:outline-none focus:border-green-600"
                    placeholder=""
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="w-72 ">
                <div className=" flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">Password</label>
                  <input
                    className=" text-input border-b-2 focus:outline-none focus:border-green-600"
                    placeholder="  "
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="w-72 ">
                <div className=" flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">Confirm Password</label>
                  <input
                    className=" text-input border-b-2 focus:outline-none focus:border-green-600"
                    placeholder="  "
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              className=" w-1/2 mt-10 bg-green-500 text-white py-2 px-4 rounded-md text-base  hover:bg-green-600"
              onClick={handleSignup}
            >
              <span className="">{signUpStatus}</span>
            </button>
            <button onClick={handleToggle}>Continue to log in</button>
          </div>{" "}
        </div>
      )}
      <div className="md:flex bg-regal-blue items-center justify-center pt-1 md:p-20 row-start-1 md:col-start-2 ">
        <div className="items-center  flex flex-col">
          <div className="pb-3 hidden md:flex">
            <LogoTree height={"200px"}></LogoTree>
          </div>

          <h2 className="text-6xl font-normal font-display text-white ">
            HortiLoader
          </h2>
          <p className="text-sm  text-white font-medium- md:font-semibold md:text-lg">
            Create and track orders
          </p>
        </div>
      </div>
    </div>
  );
}
