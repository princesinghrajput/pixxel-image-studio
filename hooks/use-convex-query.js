import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
  const result = useQuery(query, ...args);
  const isSkipped = args[0] === "skip";
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use effect to handle the state changes based on the query result
  useEffect(() => {
    if (isSkipped) {
      setData(undefined);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (result === undefined) {
      setIsLoading(true);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isSkipped, result]);

  return {
    data,
    isLoading,
    error,
  };
};

export const useConvexMutation = (mutation) => {
  const mutationFn = useMutation(mutation);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};
