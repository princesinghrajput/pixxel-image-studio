import { useDemoUser } from "./use-demo-user";

export function useStoreUser() {
  const { isReady, isLoading } = useDemoUser();

  return {
    isLoading,
    isAuthenticated: isReady,
  };
}
