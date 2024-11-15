import type { Clazz } from "@/services/class";
import type { Subject } from "@/services/subject";
import { create } from "zustand";

type State = {
  clazz: Clazz | null;
  subject: Subject | null;
};

type Action = {
  updateIsolationCondition: (data: { clazz: Clazz; subject: Subject }) => void;
};

export const useGlobalStore = create<State & Action>((set, _get) => ({
  clazz: null,
  subject: null,

  updateIsolationCondition: (data) => {
    set(data);
  },
}));
