import { Student } from "./types";
import { getDatabase } from "./database";

export type InsertStudentParams = Omit<Student, "id">;

// 插入学生记录
export const insertStudent = async (student: InsertStudentParams) => {
  const db = await getDatabase();
  const res = await db.execute(
    "INSERT INTO student (name, stu_no, class_id, subject_id) VALUES (?, ?, ?, ?)",
    [student.name, student.stuNo, student.classId, student.subjectId],
  );
  return res;
};

// 删除学生记录
export const deleteStudent = async (id: Student["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("DELETE FROM student WHERE id = ?", [id]);
  return res;
};

// 更新学生记录
export const updateStudent = async (student: Student) => {
  const db = await getDatabase();
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
export const getStudent = async (id: Student["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("SELECT * FROM student WHERE id = ?", [id]);
  return res;
};

// 获取全部学生记录
export const getAllStudents = async () => {
  const db = await getDatabase();
  const res = await db.select<Student[]>("SELECT * FROM student");
  return res.map((v) => Student.fromJSON(v));
};
