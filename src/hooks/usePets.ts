import { useCallback, useEffect, useState } from "react";
import { fetchPets } from "../api/pets";
import type { Pet } from "../types/pet";

export type FetchStatus = "loading" | "success" | "error";

export interface UsePetsResult {
  pets: Pet[];
  status: FetchStatus;
  error: string | null;
  isEmpty: boolean;
  refetch: () => void;
}

export function usePets(): UsePetsResult {
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetchPets(controller.signal)
      .then((data) => {
        setPets(data);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      });

    return () => controller.abort();
  }, [reloadKey]);

  return {
    pets,
    status,
    error,
    isEmpty: status === "success" && pets.length === 0,
    refetch,
  };
}
