import { Separator } from "@/components/ui/separator";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import DataOperations from "./components/data-operations";
import FilterBar from "./components/filter-bar";
import TitleBar from "./components/title-bar";
import DataList from "./components/data-list";
import { operationConfigs } from "./share";
import { Student, StudentGroup } from "@/services/types";
import { useStudentStore } from "@/stores/student-store";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ManualSelector,
  useManualSelectorStore,
} from "./selectors/manual-selector";
import {
  RandomSelector,
  useRandomSelectorStore,
} from "./selectors/random-selector";
import EcCard from "@/components/share/ec-card";

// Sample data
const studentList: Student[] = [
  new Student("1", "吴山茶", "11", 1, 1),
  new Student("2", "孙菖蒲", "22", 1, 1),
  new Student("3", "冯桃花", "33", 1, 1),
];

const studentGroupList: StudentGroup[] = [
  new StudentGroup("11", "茉莉", 1, [1, 2]),
  new StudentGroup("12", "香菊", 1, [2, 3]),
];

export default function RollCall() {
  const updateAllDataList = useStudentStore((s) => s.updateAllDataList);
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const updateIsLockMode = useStudentStore((s) => s.updateIsLockMode);
  const updateOperationConfigs = useStudentStore(
    (s) => s.updateOperationConfigs,
  );
  const updateSelectedDataList = useStudentStore(
    (s) => s.updateSelectedDataList,
  );

  useEffect(() => {
    updateAllDataList([...studentList, ...studentGroupList]);
    updateOperationConfigs(operationConfigs);
  }, []);

  /** 操作模式切换 */
  const handleSelectOperation = (val: string) => {
    updateIsLockMode(val === "lock-mode");
  };

  /** 选择器 */
  const [selectMode, setSelectMode] = useState<string>("manual");
  useEffect(() => {
    updateSelectedDataList([]);
  }, [selectMode, updateSelectedDataList]);
  const selector = useMemo(() => {
    if (selectMode === "manual")
      return {
        component: ManualSelector,
        onSelect: useManualSelectorStore.getState().onSelect,
      };
    if (selectMode === "random")
      return {
        component: RandomSelector,
        onSelect: useRandomSelectorStore.getState().onSelect,
      };
    return {
      component: () => <div>未知选择模式</div>,
      onSelect: () => {},
    };
  }, [selectMode]);

  /** 操作栏动画 */
  const [operationListParent, enableOperationListAnimations] = useAutoAnimate();
  useEffect(() => {
    enableOperationListAnimations(true);
  }, []);

  return (
    <div className="h-full grid grid-rows-[auto_1fr] px-2">
      <TitleBar handleSelectOperation={handleSelectOperation} />
      <div className="mt-3 flex flex-col gap-3">
        {/* 搜索项 */}
        <FilterBar />
        {/* 操作列表 */}
        <div
          ref={operationListParent}
          className="flex flex-wrap items-center gap-3"
        >
          {/* 选择操作 */}
          {!isLockMode && (
            <EcCard title="数据选择">
              {/* 选择模式 */}
              <Select
                defaultValue="manual"
                value={selectMode}
                onValueChange={setSelectMode}
              >
                <SelectTrigger className="shrink-0 w-24">
                  <SelectValue placeholder="选择模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">手动</SelectItem>
                  <SelectItem value="random">随机</SelectItem>
                </SelectContent>
              </Select>

              <selector.component />
            </EcCard>
          )}

          {/* 数据操作 */}
          <EcCard title="数据操作">
            <DataOperations />
          </EcCard>
        </div>
        {/* 数据列表 */}
        <DataList onSelect={selector.onSelect} />
      </div>
    </div>
  );
}
