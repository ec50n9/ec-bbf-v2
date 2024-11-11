import { getDatabase } from "./database";
import { StudentGroup } from "./types";

export type InsertStudentGroupParams = Omit<StudentGroup, "id">;

// 插入学生分组记录
export const insertStudentGroup = async (studentGroup: InsertStudentGroupParams) => {
  const db = await getDatabase();
  const res = await db.execute(
    "INSERT INTO student_group (name, subject_id, student_ids) VALUES (?, ?, ?)",
    [studentGroup.name, studentGroup.subjectId, studentGroup.studentIds],
  );
  return res;
};

// 删除学生分组记录
export const deleteStudentGroup = async (id: StudentGroup["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("DELETE FROM student_group WHERE id = ?", [id]);
  return res;
};

// 更新学生分组记录
export const updateStudentGroup = async (studentGroup: StudentGroup) => {
  const db = await getDatabase();
  const res = await db.execute(
    "UPDATE student_group SET name = ?, subject_id = ? WHERE id = ?",
    [studentGroup.name, studentGroup.subjectId, studentGroup.id],
  );
  return res;
};

// 查询学生分组记录
export const getStudentGroup = async (id: StudentGroup["id"]) => {
  const db = await getDatabase();
  const res = await db.select<any[]>("SELECT * FROM student_group WHERE id = ?", [
    id,
  ]);
  return res.map((v) => StudentGroup.fromJSON(v));
};

// 获取全部学生分组记录
export const getAllStudentGroups = async () => {
  const db = await getDatabase();
  const res = await db.select<any[]>("SELECT * FROM student_group");
  return res.map((v) => StudentGroup.fromJSON(v));
};
