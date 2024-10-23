import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllStudents,
  insertStudent,
  InsertStudentParams,
} from "@/services/student";
import type { Student } from "@/services/types";
import { useStudentStore } from "@/stores/student-store";
import { create } from "zustand";

type DbProviderState = {
  initData: () => Promise<void>;
  addStudent: (student: InsertStudentParams) => Promise<number>;
};

export const useDbProviderStore = create<DbProviderState>((set, get) => ({
  initData: async () => {
    const updateAllDataList = useStudentStore.getState().updateAllDataList;

    const students = await getAllStudents();
    console.log("students:", students);
    updateAllDataList(students);
  },
  addStudent: async (student: InsertStudentParams) => {
    const res = await insertStudent(student);
    await get().initData();
    return res.lastInsertId;
  },
}));

export const DbProvider = () => {
  const addStudent = useDbProviderStore((state) => state.addStudent);

  const handleAddStudent = async () => {
    const res = await addStudent({
      stuNo: "111",
      name: "两钉钉",
      classId: 1,
      subjectId: 1,
    });
    console.log("insert student res", res);
  };

  return (
    <>
      <Select defaultValue="all">
        <SelectTrigger className="w-28">
          <SelectValue placeholder="选择数据类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="student">仅学生</SelectItem>
          <SelectItem value="student-group">仅分组</SelectItem>
        </SelectContent>
      </Select>

      <Input className="w-40" placeholder="输入关键词搜索" />

      <Button size="sm" variant="default">
        搜索
      </Button>
      <Button size="sm" variant="default" onClick={handleAddStudent}>
        添加
      </Button>
    </>
  );
};
