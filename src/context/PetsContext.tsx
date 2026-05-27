import { createContext, useContext, type ReactNode } from "react";
import { usePets, type UsePetsResult } from "../hooks/usePets";

const PetsContext = createContext<UsePetsResult | null>(null);

export function PetsProvider({ children }: { children: ReactNode }) {
  const value = usePets();
  return <PetsContext.Provider value={value}>{children}</PetsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook intentionally co-located with its provider
export function usePetsContext(): UsePetsResult {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error("usePetsContext must be used inside <PetsProvider>");
  return ctx;
}
