import { insertClass } from "@/services/class";
import { insertSubject } from "@/services/subject";
import { create } from "zustand";

type State = {
  clazzName: string | null;
  grade: string | null;
  clazz: string | null;
  clazzId: number | null;
  subjectName: string | null;
  subjectId: number | null;
};

type Action = {
  createClass: (data: {
    clazzName: string;
    grade: string;
    clazz?: string;
  }) => Promise<void>;
  createSubject: (data: { subjectName: string }) => Promise<void>;
};

export const useLoginStore = create<State & Action>((set, get) => ({
  clazzName: null,
  grade: null,
  clazz: null,
  clazzId: null,
  subjectName: null,
  subjectId: null,

  createClass: async (data) => {
    const res = await insertClass({
      name: data.clazzName,
      grade: data.grade,
      clazz: data.clazz || "",
    });

    set({
      clazzName: data.clazzName,
      grade: data.grade,
      clazz: data.clazz,
      clazzId: res.lastInsertId,
    });
  },
  createSubject: async (data) => {
    const clazzId = get().clazzId;
    if (!clazzId) throw new Error("clazzId is null");

    const res = await insertSubject({
      clazzId,
      name: data.subjectName,
    });

    set({
      subjectName: data.subjectName,
      subjectId: res.lastInsertId,
    });
  },
}));
