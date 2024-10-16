import { createContext, useState, useEffect, type ReactNode } from "react";
import Database from "@tauri-apps/plugin-sql";

interface DatabaseContextType {
  db: Database | null;
  error: Error | null;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

let databaseInstance: Database | null = null;

async function initializeDatabase() {
  if (!databaseInstance) {
    try {
      databaseInstance = await Database.load("sqlite:app-data.db");
    } catch (err) {
      console.error("Failed to load database:", err);
      throw err;
    }
  }
  return databaseInstance;
}

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initializeDatabase()
      .then(setDb)
      .catch((err) =>
        setError(err instanceof Error ? err : new Error(String(err))),
      );

    return () => {
      // 在应用关闭时关闭数据库连接
      databaseInstance?.close();
      databaseInstance = null;
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}
