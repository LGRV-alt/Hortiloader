import { useState } from "react";
import pb from "../Components/lib/pocketbase";

export default function useLogout() {
  const [dummy, setDummy] = useState(1);
  function logout() {
    pb.authStore.clear();
    setDummy(Math.random());
  }
  return logout;
}
