import { useState } from "react";
import { login, signup } from "./Components/lib/pocketbase";

export default function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [toggle, setToggle] = useState(true);

  const handleLogin = () => {
    if (!username || !password) {
      window.alert("Invalid Login credentials");
      return;
    }
    login(username, password);
  };

  const handleSignup = () => {
    if (!username || !password) {
      window.alert("Invalid Login credentials");
      return;
    }
    signup(username, password);
    setUsername("");
    setPassword("");
  };

  const handleToggle = () => {
    setUsername("");
    setPassword("");
    setToggle(!toggle);
  };
  return (
    <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-2">
      {toggle ? (
        <div className=" flex flex-col justify-evenly items-center">
          <div className="bg-white flex flex-col justify-center items-center  h-full">
            <h2 className="text-2xl  font-semibold  mb-10">Welcome</h2>
            <div className="grid gap-6 mt-4 text-base">
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
              onClick={handleLogin}
            >
              <span className="">Sign in</span>
            </button>
            <button onClick={handleToggle}>Create an account</button>
          </div>{" "}
        </div>
      ) : (
        <div className=" flex flex-col justify-evenly items-center">
          <div className="bg-white flex flex-col justify-center items-center  h-full">
            <h2 className="text-2xl  font-semibold  mb-10">Create New User</h2>
            <div className="grid gap-6 mt-4 text-base">
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
              <span className="">Create User</span>
            </button>
            <button onClick={handleToggle}>Continue to log in</button>
          </div>{" "}
        </div>
        // <div className="flex flex-col justify-evenly items-center">
        //   <div className="bg-white flex flex-col justify-center items-start">
        //     <h2>Create A New Account</h2>
        //     <div className="grid gap-6 mt-4 text-base">
        //       <input
        //         className="text-input "
        //         type="text"
        //         placeholder="Username"
        //         value={username}
        //         onChange={(e) => setUsername(e.target.value)}
        //         required
        //       />
        //       <input
        //         className="text-input"
        //         onChange={(e) => setPassword(e.target.value)}
        //         type="password"
        //         placeholder="Password"
        //       />
        //     </div>

        //     <button
        //       className="bg-green-500 text-white py-2 px-4 rounded-md text-base mt-6 hover:bg-green-600"
        //       onClick={handleSignup}
        //     >
        //       <div className="flex">
        //         <span className="material-symbols-outlined -ml-2">login</span>
        //         <p className="text-base ml-2">Continue</p>
        //       </div>
        //     </button>
        //     <button onClick={() => setToggle(!toggle)}>
        //       Continue to Login
        //     </button>
        //   </div>
        // </div>
      )}
      <div className="md:flex hidden bg-stone-500 items-center p-20">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem
          quasi consequuntur quod saepe numquam facilis dicta quas expedita odit
          libero, dolores deleniti dolor in at dignissimos ipsum necessitatibus
          molestiae tenetur.
        </p>
      </div>

      {/* <div className="flex flex-col justify-evenly items-center">
        <div className="bg-white flex flex-col justify-center items-start">
          <h2>Log In As Existing User</h2>
          <div className="grid gap-6 mt-4 text-base">
            <input
              className="text-input "
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="text-input"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>

          <button
            className="bg-green-500 text-white py-2 px-4 rounded-md text-base mt-6 hover:bg-green-600"
            onClick={handleLogin}
          >
            <div className="flex">
              <span className="material-symbols-outlined -ml-2">login</span>
            </div>
          </button>
          <button onClick={() => setToggle(!toggle)}>Create an account</button>
        </div>

        <div className="bg-white flex flex-col justify-center items-start">
          <h2>Create A New Account</h2>
          <div className="grid gap-6 mt-4 text-base">
            <input
              className="text-input "
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="text-input"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>

          <button
            className="bg-green-500 text-white py-2 px-4 rounded-md text-base mt-6 hover:bg-green-600"
            onClick={handleSignup}
          >
            <div className="flex">
              <span className="material-symbols-outlined -ml-2">login</span>
              <p className="text-base ml-2">Continue</p>
            </div>
          </button>
        </div>
      </div>
      <div className="md:flex hidden bg-stone-500 items-center p-20">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem
          quasi consequuntur quod saepe numquam facilis dicta quas expedita odit
          libero, dolores deleniti dolor in at dignissimos ipsum necessitatibus
          molestiae tenetur.
        </p>
      </div> */}
    </div>
  );
}
