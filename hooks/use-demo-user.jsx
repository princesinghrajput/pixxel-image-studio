import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useDemoUser() {
  const ensureDemoUser = useMutation(api.users.ensureDemoUser);
  const [state, setState] = useState({
    isReady: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function bootstrapDemoUser() {
      try {
        await ensureDemoUser();

        if (!cancelled) {
          setState({
            isReady: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            isReady: false,
            isLoading: false,
            error,
          });
        }
      }
    }

    bootstrapDemoUser();

    return () => {
      cancelled = true;
    };
  }, [ensureDemoUser]);

  return state;
}
