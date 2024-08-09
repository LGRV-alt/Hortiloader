import { useState } from "react";
import pb from "./Components/lib/pocketbase";
import { useForm } from "react-hook-form";
import useLogout from "./hooks/useLogout";
import useLogin from "./hooks/useLogin";

export default function Login() {
  const { register, handleSubmit, reset } = useForm();
  const logout = useLogout();
  const { mutate, isLoading, isError } = useLogin();

  const isLoggedIn = pb.authStore.isValid;

  async function onSubmit(data) {
    mutate({ email: data.email, password: data.password });
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
        {isError && <p>Invalid email or password</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
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
