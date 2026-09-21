import { createContext, type PropsWithChildren, useContext, useMemo } from "react";

import { db } from "@/lib/db";

interface DbContextType {
  db: typeof db;
}

const DbContext = createContext<DbContextType | null>(null);

export function DbProvider({ children }: PropsWithChildren) {
  const value = useMemo<DbContextType>(
    () => ({
      db,
    }),
    [],
  );

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}

export function useDb() {
  const context = useContext(DbContext);

  if (!context) {
    throw new Error("useDb must be used within a DbProvider");
  }

  return context;
}
