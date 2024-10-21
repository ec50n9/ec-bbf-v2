import { Separator } from "@/components/ui/separator";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import DataOperations from "./components/data-operations";
import FilterBar from "./components/filter-bar";
import SelectOperations from "./components/select-operations";
import TitleBar from "./components/title-bar";
import DataList from "./components/data-list";
import { operationConfigs } from "./share";
import { type MixedData, Student, StudentGroup } from "@/services/types";
import { useStudentStore } from "@/stores/student-store";
import { useManualSelectorStore } from "@/stores/student-store";
import { useEffect } from "react";

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
  const updateSelectedDataList = useStudentStore(
    (s) => s.updateSelectedDataList,
  );
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const updateIsLockMode = useStudentStore((s) => s.updateIsLockMode);
  const updateLockedOperation = useStudentStore(
    (s) => s.updateLockedOperationKey,
  );
  const updateOperationConfigs = useStudentStore(
    (s) => s.updateOperationConfigs,
  );

  useEffect(() => {
    updateAllDataList([...studentList, ...studentGroupList]);
    updateOperationConfigs(operationConfigs);
  }, []);

  /** 操作模式切换 */
  const handleSelectOperation = (val: string) => {
    updateLockedOperation(null);
    updateSelectedDataList([]);
    updateIsLockMode(val === "lock-mode");
  };

  /** 操作列表动画 */
  const [operationListParent, enableOperationListAnimations] = useAutoAnimate();
  enableOperationListAnimations(true);

  return (
    <div className="h-full grid grid-rows-[auto_1fr] px-2">
      <TitleBar handleSelectOperation={handleSelectOperation} />
      <div className="mt-3 flex flex-col gap-3">
        {/* 搜索项 */}
        <FilterBar />
        {/* 操作列表 */}
        <div ref={operationListParent} className="flex items-center gap-3">
          {!isLockMode && (
            <>
              <SelectOperations />
              <Separator orientation="vertical" />
            </>
          )}
          {/* 操作列表 */}
          <DataOperations />
        </div>
        {/* 数据列表 */}
        <DataList />
      </div>
    </div>
  );
}
