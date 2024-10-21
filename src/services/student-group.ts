import type Database from "@tauri-apps/plugin-sql";
import type { StudentGroup } from "./types";

// 插入学生分组记录
export const insertStudentGroup = async (
  db: Database,
  studentGroup: Omit<StudentGroup, "id">,
) => {
  const res = await db.execute(
    "INSERT INTO student_group (name, subject_id) VALUES (?, ?)",
    [studentGroup.name, studentGroup.subjectId],
  );
  return res;
};

// 删除学生分组记录
export const deleteStudentGroup = async (
  db: Database,
  id: StudentGroup["id"],
) => {
  const res = await db.execute("DELETE FROM student_group WHERE id = ?", [id]);
  return res;
};

// 更新学生分组记录
export const updateStudentGroup = async (
  db: Database,
  studentGroup: StudentGroup,
) => {
  const res = await db.execute(
    "UPDATE student_group SET name = ?, subject_id = ? WHERE id = ?",
    [studentGroup.name, studentGroup.subjectId, studentGroup.id],
  );
  return res;
};

// 查询学生分组记录
export const getStudentGroup = async (db: Database, id: StudentGroup["id"]) => {
  const res = await db.execute("SELECT * FROM student_group WHERE id = ?", [
    id,
  ]);
  return res;
};
