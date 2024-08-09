import { useState } from "react";
import pb from "./Components/lib/pocketbase";
import { useForm } from "react-hook-form";

export default function Login() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [dummy, setDummy] = useState(0);

  const isLoggedIn = pb.authStore.isValid;

  function logout() {
    pb.authStore.clear();
    setDummy(Math.random());
  }

  async function login(data) {
    setLoading(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(data.email, data.password);
      console.log(data);
    } catch (e) {
      alert(e);
    }
    setLoading(false);
    reset();
  }

  if (isLoggedIn)
    return (
      <div>
        <h1>Logged In: {pb.authStore.model.email}</h1>
        <button onClick={logout}>Log Out</button>
      </div>
    );

  return (
    <>
      <div className="flex flex-col">
        <h1>Please Log In</h1>
        {isLoading && <p>Loading....</p>}
        <form onSubmit={handleSubmit(login)}>
          <input type="text" placeholder="email" {...register("email")} />
          <input
            type="password"
            placeholder="password"
            {...register("password")}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading" : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}
