import { useState } from "react";
import { login, signup } from "./Components/lib/pocketbase";
import LogoTree from "./Components/LogoTree";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [toggle, setToggle] = useState(true);
  const [loginStatus, setLoginStatus] = useState("Sign In");
  const [signUpStatus, setSignUpStatus] = useState("Sign up");

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    setLoginStatus("Logging In");
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

    setSignUpStatus("Creating...");

    const result = await signup(username, password, email);

    if (!result.success) {
      toast.error(result.message);
      setSignUpStatus("Sign up");
      return;
    }
    toast.success("User created successfully!");
    setToggle(!toggle);
    setSignUpStatus("Sign up");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleToggle = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setToggle(!toggle);
  };
  return (
    <div className="grid grid-rows-[1fr_10fr] grid-cols-1 md:grid-cols-2 md:grid-rows-1 ">
      {toggle ? (
        <div className=" flex flex-col justify-evenly items-center">
          <div className="bg-white flex flex-col  items-center pt-10  h-full md:justify-center">
            <h2 className="text-2xl  font-semibold  mb-10">Welcome</h2>
            <div className="grid gap-6 mt-4 text-base">
              <div className="w-72">
                <div className=" mb-2 flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">
                    Username
                    <input
                      className="font-semibold text-xl text-input border-b-2 focus:outline-none focus:border-green-600"
                      placeholder=""
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="w-72 ">
                <div className=" mb-2 flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">
                    Password
                    <input
                      className="font-semibold text-xl text-input border-b-2 focus:outline-none focus:border-green-600"
                      placeholder="  "
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              className=" w-1/2 mt-10 bg-green-500 text-white py-2 px-4 rounded-md text-base  hover:bg-green-600"
              onClick={handleLogin}
            >
              <span className="">{loginStatus}</span>
            </button>
            <button onClick={handleToggle}>Create an account</button>
          </div>{" "}
        </div>
      ) : (
        <div className=" flex flex-col justify-evenly items-center">
          <div className="bg-white flex flex-col  items-center pt-10 h-full md:justify-center">
            <h2 className="text-2xl  font-semibold  mb-10">Sign up</h2>
            <div className="grid gap-6 mt-4 text-base">
              <div className="w-72 ">
                <div className=" flex flex-col w-full min-w-[200px] h-10">
                  <label className="font-thin">Email</label>
                  <input
                    className=" text-input text-lg border-b-2 focus:outline-none focus:border-green-600"
                    placeholder="  "
                    type="text"
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
                    className="font-semibold text-xl text-input border-b-2 focus:outline-none focus:border-green-600"
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
                    className=" text-input text-lg border-b-2 focus:outline-none focus:border-green-600"
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
