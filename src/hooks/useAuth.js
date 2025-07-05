import { useEffect, useState } from "react";
import pb from "../api/pbConnect";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid);
    });

    return () => unsub();
  }, []);

  return isAuthenticated;
}
