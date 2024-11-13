import { create } from "zustand";
import { getAllStudents, insertStudent, deleteStudent } from "@/services/student";
import { useStudentStore } from "@/stores/student-store";
import type { InsertStudentParams } from "@/services/student";

type DbProviderState = {
    initData: () => Promise<void>;
    addStudent: (student: InsertStudentParams) => Promise<number>;
    delStudent: (id: number) => Promise<void>;
};

export const useDbProviderStore = create<DbProviderState>((_set, get) => ({
    initData: async () => {
        const updateAllDataList = useStudentStore.getState().updateAllDataList;

        const students = await getAllStudents();
        updateAllDataList(students);
    },
    addStudent: async (student: InsertStudentParams) => {
        const res = await insertStudent(student);
        await get().initData();
        return res.lastInsertId;
    },
    delStudent: async (id: number) => {
        await deleteStudent(id);
        await get().initData();
    },
}));