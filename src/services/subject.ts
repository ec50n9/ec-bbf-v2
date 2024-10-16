import type Database from "@tauri-apps/plugin-sql";

export type Subject = {
  id: number;
  name: string;
  class_id: number;
};

// 插入科目记录
export const insertSubject = async (
  db: Database,
  subject: Omit<Subject, "id">,
) => {
  const res = await db.execute(
    "INSERT INTO subject (name, class_id) VALUES (?, ?)",
    [subject.name, subject.class_id],
  );
  return res;
};

// 删除科目记录
export const deleteSubject = async (db: Database, id: Subject["id"]) => {
  const res = await db.execute("DELETE FROM subject WHERE id = ?", [id]);
  return res;
};

// 更新科目记录
export const updateSubject = async (db: Database, subject: Subject) => {
  const res = await db.execute(
    "UPDATE subject SET name = ?, class_id = ? WHERE id = ?",
    [subject.name, subject.class_id, subject.id],
  );
  return res;
};

// 查询科目记录
export const getSubject = async (db: Database, id: Subject["id"]) => {
  const res = await db.execute("SELECT * FROM subject WHERE id = ?", [id]);
  return res;
};
