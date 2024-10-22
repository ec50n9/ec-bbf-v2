import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { MixedData } from "@/services/types";
import { useStudentStore } from "@/stores/student-store";
import { Label } from "@radix-ui/react-dropdown-menu";
import { create } from "zustand";

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

/** 选择操作 */
export const ManualSelector = () => {
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const isAllSelected = useStudentStore((s) => s.isAllSelected());
  const selectedDataList = useStudentStore((s) => s.selectedDataList);
  const updateSelectedDataList = useStudentStore(
    (s) => s.updateSelectedDataList,
  );

  const isMultiSelect = useManualSelectorStore((s) => s.isMultiSelect);
  const updateIsMultiSelect = useManualSelectorStore(
    (s) => s.updateIsMultiSelect,
  );
  const toggleAllSelect = useManualSelectorStore((s) => s.toggleAllSelect);
  const reverseSelect = useManualSelectorStore((s) => s.reverseSelect);

  return (
    <>
      {/* 单/多选 */}
      <div className="flex items-center space-x-2">
        <Switch
          id="airplane-mode"
          checked={isMultiSelect}
          onCheckedChange={updateIsMultiSelect}
          disabled={isLockMode}
        />
        <Label htmlFor="airplane-mode">多选</Label>
      </div>
      {isMultiSelect && (
        <>
          {/* 清空选择 */}
          {!!selectedDataList.length && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                updateSelectedDataList([]);
              }}
            >
              取消选择
            </Button>
          )}
          {/* 全(不)选 */}
          <Button size="sm" variant="outline" onClick={toggleAllSelect}>
            {isAllSelected ? "全不选" : "全选"}
          </Button>
          {/* 反选 */}
          <Button size="sm" variant="outline" onClick={reverseSelect}>
            反选
          </Button>
        </>
      )}
    </>
  );
};
