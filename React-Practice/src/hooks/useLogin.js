import pb from "../Components/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";

export default function useLogin() {
  async function login({ email, password }) {
    console.log(email, password);
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
  }
  return useMutation(login);
}
