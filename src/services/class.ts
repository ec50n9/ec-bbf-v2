import type Database from "@tauri-apps/plugin-sql";

export type Class = {
  id: number;
  name: string;
  grade: string;
  class: string;
};

// 插入班级记录
export const insertClass = async (
  db: Database,
  classData: Omit<Class, "id">,
) => {
  const res = await db.execute(
    "INSERT INTO class (name, grade, class) VALUES (?, ?, ?)",
    [classData.name, classData.grade, classData.class],
  );
  return res;
};

// 删除班级记录
export const deleteClass = async (db: Database, id: Class["id"]) => {
  const res = await db.execute("DELETE FROM class WHERE id = ?", [id]);
  return res;
};

// 更新班级记录
export const updateClass = async (db: Database, classData: Class) => {
  const res = await db.execute(
    "UPDATE class SET name = ?, grade = ?, class = ? WHERE id = ?",
    [classData.name, classData.grade, classData.class, classData.id],
  );
  return res;
};

// 查询班级记录
export const getClass = async (db: Database, id: Class["id"]) => {
  const res = await db.execute("SELECT * FROM class WHERE id = ?", [id]);
  return res;
};

// 获取全部班级记录
export const getAllClasses = async (db: Database) => {
  const res = await db.select("SELECT * FROM class");
  return res;
};
