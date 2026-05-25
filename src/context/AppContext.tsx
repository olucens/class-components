import { useState, type ReactNode } from "react";
import { AppContext, type AppContextType } from "./AppContextType";

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error("Test error triggered!");
  }

  const value: AppContextType = {
    triggerError: () => setThrowError(true),
    hasError,
    resetError: () => {
      setThrowError(false);
      setHasError(false);
    },
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
