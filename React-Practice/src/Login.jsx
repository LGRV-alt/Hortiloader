import { useState } from "react";
import pb from "./Components/lib/pocketbase";
import { useForm } from "react-hook-form";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [isLoading, setLoading] = useState(false);
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
  }

  return (
    <>
      <div className="flex flex-col">
        <h1>Logged In: {pb.authStore.isValid.toString()}</h1>
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
