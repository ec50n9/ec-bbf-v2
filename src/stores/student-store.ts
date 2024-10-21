import type { MixedData } from "@/services/types";
import type { OperationConfig } from "@/components/share/ec-data-list";
import { create } from "zustand";
import type { Constructor } from "@/components/share/ec-data-list/share";

type State = {
  allDataList: MixedData[];
  selectedDataList: MixedData[];
  operationConfigs: OperationConfig<MixedData>[];
  isLockMode: boolean;
  lockedOperationKey: OperationConfig<MixedData>["key"] | null;
};

type Getter = {
  isAllSelected: () => boolean;
  lockedOperation: () => OperationConfig<MixedData> | null;
  selectedDataTypes: () => Constructor<MixedData>[];
  supportedActions: () => OperationConfig<MixedData>[];
};

type Action = {
  updateAllDataList: (data: State["allDataList"]) => void;
  updateSelectedDataList: (data: State["selectedDataList"]) => void;
  updateOperationConfigs: (configs: State["operationConfigs"]) => void;
  updateIsLockMode: (isLockMode: State["isLockMode"]) => void;
  updateLockedOperationKey: (operation: State["lockedOperationKey"]) => void;
};

export const useStudentStore = create<State & Getter & Action>((set, get) => ({
  allDataList: [],
  selectedDataList: [],
  isAllSelected: () => {
    const { allDataList, selectedDataList } = get();
    return allDataList.length === selectedDataList.length;
  },
  lockedOperation: () => {
    const { operationConfigs, lockedOperationKey } = get();
    return (
      operationConfigs.find((config) => config.key === lockedOperationKey) ||
      null
    );
  },
  selectedDataTypes: () =>
    get().selectedDataList.map((i) => i.constructor as Constructor<MixedData>),
  supportedActions: () => {
    const { operationConfigs, selectedDataTypes: $selectedDataTypes } = get();
    const selectedDataTypes = $selectedDataTypes();

    return operationConfigs.filter((c) =>
      selectedDataTypes.every((t) => c.supportedTypes.includes(t)),
    );
  },
  operationConfigs: [],
  isLockMode: false,
  lockedOperationKey: null,
  updateAllDataList: (data) => set({ allDataList: data }),
  updateSelectedDataList: (data) => set({ selectedDataList: data }),
  updateOperationConfigs: (configs) => set({ operationConfigs: configs }),
  updateIsLockMode: (isLockMode) => set({ isLockMode }),
  updateLockedOperationKey: (operation) =>
    set({ lockedOperationKey: operation }),
}));

type ManualSelectorState = {
  onSelect: (data: MixedData) => void;
  isMultiSelect: boolean;
  updateIsMultiSelect: (val: boolean) => void;
  toggleAllSelect: () => void;
  reverseSelect: () => void;
};

export const useManualSelectorStore = create<ManualSelectorState>(
  (set, get) => ({
    isMultiSelect: false,

    onSelect: (data: MixedData) => {
      const selectedDataList = useStudentStore.getState().selectedDataList;
      const updateSelectedDataList =
        useStudentStore.getState().updateSelectedDataList;

      // 多选模式
      if (get().isMultiSelect) {
        const newList = selectedDataList.includes(data)
          ? selectedDataList.filter((item) => item !== data)
          : [...selectedDataList, data];
        useStudentStore.getState().updateSelectedDataList(newList);
      }
      // 单选模式
      else {
        if (data === selectedDataList[0]) updateSelectedDataList([]);
        else updateSelectedDataList([data]);
      }
    },

    /** 切换单选多选 */
    updateIsMultiSelect: (val: boolean) => {
      const { selectedDataList, updateSelectedDataList } =
        useStudentStore.getState();
      if (!val && selectedDataList.length) {
        updateSelectedDataList([selectedDataList[0]]);
      }
      set({ isMultiSelect: val });
    },

    /** 切换全选 */
    toggleAllSelect: () => {
      const { allDataList, updateSelectedDataList, isAllSelected } =
        useStudentStore.getState();

      if (isAllSelected()) updateSelectedDataList([]);
      else updateSelectedDataList([...allDataList]);
    },

    /** 反选 */
    reverseSelect: () => {
      const { selectedDataList, updateSelectedDataList, allDataList } =
        useStudentStore.getState();

      updateSelectedDataList(
        allDataList.filter((item) => !selectedDataList.includes(item)),
      );
    },
  }),
);
