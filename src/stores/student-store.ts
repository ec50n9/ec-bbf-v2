import type { MixedData } from "@/services/types";
import type { ActionConfig, Constructor } from "@/types/plugin";
import { create } from "zustand";

import { usePluginStore } from "./plugin-store";

type State = {
  allDataList: MixedData[];
  selectedDataList: MixedData[];
  isLockMode: boolean;
  lockedOperationKey: ActionConfig<MixedData>["key"] | null;
  lockedOperationArgs: any;
};

type Getter = {
  isAllSelected: () => boolean;
  lockedOperation: () => ActionConfig<MixedData> | null;
  selectedDataTypes: () => Constructor<MixedData>[];
  supportedActions: () => ActionConfig<MixedData>[];
};

type Action = {
  updateAllDataList: (data: State["allDataList"]) => void;
  updateSelectedDataList: (data: State["selectedDataList"]) => void;
  updateIsLockMode: (isLockMode: State["isLockMode"]) => void;
  updateLockedOperationKey: (operation: State["lockedOperationKey"]) => void;
  updateLockedOperationArgs: (args: State["lockedOperationArgs"]) => void;
};

export const useStudentStore = create<State & Getter & Action>((set, get) => ({
  allDataList: [],
  selectedDataList: [],
  isAllSelected: () => {
    const { allDataList, selectedDataList } = get();
    return allDataList.length === selectedDataList.length;
  },
  lockedOperation: () => {
    const { lockedOperationKey } = get();
    const { actions } = usePluginStore.getState();
    return actions.find((config) => config.key === lockedOperationKey) || null;
  },
  selectedDataTypes: () =>
    get().selectedDataList.map((i) => i.constructor as Constructor<MixedData>),
  supportedActions: () => {
    const { selectedDataTypes: $selectedDataTypes } = get();
    const { actions } = usePluginStore.getState();
    const selectedDataTypes = $selectedDataTypes();

    return actions.filter((a) =>
      selectedDataTypes.every((t) => a.supportedTypes.includes(t))
    );
  },
  operationConfigs: [],
  isLockMode: false,
  lockedOperationKey: null,
  lockedOperationArgs: null,
  updateAllDataList: (data) =>
    set((state) => {
      const allDataSet = new Set(data);
      return {
        allDataList: data,
        selectedDataList: state.selectedDataList.filter((i) =>
          allDataSet.has(i)
        ),
      };
    }),
  updateSelectedDataList: (data) => set({ selectedDataList: data }),
  updateIsLockMode: (isLockMode) => set({ isLockMode }),
  updateLockedOperationKey: (operation) =>
    set({ lockedOperationKey: operation }),
  updateLockedOperationArgs: (args) => set({ lockedOperationArgs: args }),
}));
