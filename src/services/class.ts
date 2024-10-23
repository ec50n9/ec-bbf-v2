import { getDatabase } from "./database";

export class Clazz {
  constructor(
    public id: number,
    public name: string,
    public grade: string,
    public clazz: string,
  ) {}

  static fromJSON(data: {
    id: number;
    name: string;
    grade: string;
    clazz: string;
  }) {
    return new Clazz(data.id, data.name, data.grade, data.clazz);
  }
}

// 插入班级记录
export const insertClass = async (classData: Omit<Clazz, "id">) => {
  const db = await getDatabase();
  const res = await db.execute(
    "INSERT INTO class (name, grade, class) VALUES (?, ?, ?)",
    [classData.name, classData.grade, classData.clazz],
  );
  return res;
};

// 删除班级记录
export const deleteClass = async (id: Clazz["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("DELETE FROM class WHERE id = ?", [id]);
  return res;
};

// 更新班级记录
export const updateClass = async (classData: Clazz) => {
  const db = await getDatabase();
  const res = await db.execute(
    "UPDATE class SET name = ?, grade = ?, class = ? WHERE id = ?",
    [classData.name, classData.grade, classData.clazz, classData.id],
  );
  return res;
};

// 查询班级记录
export const getClass = async (id: Clazz["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("SELECT * FROM class WHERE id = ?", [id]);
  return res;
};

// 获取全部班级记录
export const getAllClasses = async () => {
  const db = await getDatabase();
  const res = await db.select<Clazz[]>("SELECT * FROM class");
  return res.map((v) => Clazz.fromJSON(v));
};
