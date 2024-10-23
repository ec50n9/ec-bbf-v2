import { getDatabase } from "./database";

export class Subject {
  constructor(
    public id: number,
    public name: string,
    public class_id: number,
  ) {}

  static fromJSON(data: { id: number; name: string; class_id: number }) {
    return new Subject(data.id, data.name, data.class_id);
  }
}

// 插入科目记录
export const insertSubject = async (subject: Omit<Subject, "id">) => {
  const db = await getDatabase();
  const res = await db.execute(
    "INSERT INTO subject (name, class_id) VALUES (?, ?)",
    [subject.name, subject.class_id],
  );
  return res;
};

// 删除科目记录
export const deleteSubject = async (id: Subject["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("DELETE FROM subject WHERE id = ?", [id]);
  return res;
};

// 更新科目记录
export const updateSubject = async (subject: Subject) => {
  const db = await getDatabase();
  const res = await db.execute(
    "UPDATE subject SET name = ?, class_id = ? WHERE id = ?",
    [subject.name, subject.class_id, subject.id],
  );
  return res;
};

// 查询科目记录
export const getSubject = async (id: Subject["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("SELECT * FROM subject WHERE id = ?", [id]);
  return res;
};

// 获取全部班级记录
export const getAllSubjects = async () => {
  const db = await getDatabase();
  const res = await db.select<Subject[]>("SELECT * FROM class");
  return res.map((v) => Subject.fromJSON(v));
};
