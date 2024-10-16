import { createContext, useState, useEffect, type ReactNode } from "react";
import Database from "@tauri-apps/plugin-sql";
import createTablesSQL from "@/assets/sql/create-tables.sql?raw";

interface DatabaseContextType {
  db: Database | null;
  error: Error | null;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

/** 单例数据库实例 */
let databaseInstance: Database | null = null;

/** 初始化数据库连接 */
async function initializeDatabase() {
  if (!databaseInstance) {
    try {
      databaseInstance = await Database.load("sqlite:app-data.db");
      await initializeTables(databaseInstance);
    } catch (err) {
      console.error("Failed to load database:", err);
      throw err;
    }
  }
  return databaseInstance;
}

/** 初始化数据表 */
async function initializeTables(db: Database) {
  try {
    await db.execute(createTablesSQL);
    console.log("Tables initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize tables:", err);
    throw err;
  }
}

/** 数据库连接管理器 */
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
