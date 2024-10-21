import type Database from "@tauri-apps/plugin-sql";
import type { Student } from "./types";

// 插入学生记录
export const insertStudent = async (
  db: Database,
  student: Omit<Student, "id">,
) => {
  const res = await db.execute(
    "INSERT INTO student (name, stu_no, class_id, subject_id) VALUES (?, ?, ?, ?)",
    [student.name, student.stuNo, student.classId, student.subjectId],
  );
  return res;
};

// 删除学生记录
export const deleteStudent = async (db: Database, id: Student["id"]) => {
  const res = await db.execute("DELETE FROM student WHERE id = ?", [id]);
  return res;
};

// 更新学生记录
export const updateStudent = async (db: Database, student: Student) => {
  const res = await db.execute(
    "UPDATE student SET name = ?, stu_no = ?, class_id = ?, subject_id = ? WHERE id = ?",
    [
      student.name,
      student.stuNo,
      student.classId,
      student.subjectId,
      student.id,
    ],
  );
  return res;
};

// 查询学生记录
export const getStudent = async (db: Database, id: Student["id"]) => {
  const res = await db.execute("SELECT * FROM student WHERE id = ?", [id]);
  return res;
};
