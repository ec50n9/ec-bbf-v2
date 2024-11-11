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

export const resetDatabase = async () => {
  try {
    // 关闭现有连接
    if (databaseInstance) {
      await databaseInstance.close();
      databaseInstance = null;
    }

    // 重新加载数据库
    databaseInstance = await Database.load("sqlite:app-data.db");

    // 禁用外键约束
    await databaseInstance.execute("PRAGMA foreign_keys = OFF;");

    // 查询所有用户创建的表，排除 class 和 subject 表
    const result = await databaseInstance.select<{ name: string }[]>(
      `SELECT name FROM sqlite_master 
       WHERE type='table' 
       AND name NOT LIKE 'sqlite_%'
       AND name NOT IN ('class', 'subject')`
    );

    // 删除符合条件的表
    for (const { name } of result) {
      await databaseInstance.execute(`DROP TABLE IF EXISTS ${name}`);
    }

    // 重新启用外键约束
    await databaseInstance.execute("PRAGMA foreign_keys = ON;");

    // 重新初始化表
    await initializeTables(databaseInstance);

    console.log("数据库已重置");
  } catch (err) {
    console.error("重置数据库失败:", err);
    throw err;
  }
};
