import Database from "@tauri-apps/plugin-sql";
import createTablesSQL from "@/assets/sql/create-tables.sql?raw";

let databaseInstance: Database | null = null;

export const getDatabase = async () => {
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
};

const initializeTables = async (db: Database) => {
  try {
    await db.execute(createTablesSQL);
    console.log("Tables initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize tables:", err);
    throw err;
  }
};
