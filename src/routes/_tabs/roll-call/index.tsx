import type { OperationConfig } from "@/components/share/ec-data-list";
import { Separator } from "@/components/ui/separator";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMemo, useState } from "react";
import DataOperations from "./components/data-operations";
import FilterBar from "./components/filter-bar";
import SelectOperations from "./components/select-operations";
import TitleBar from "./components/title-bar";
import DataList from "./components/data-list";
import {
  operationConfigs,
  Student,
  StudentGroup,
  type MixedData,
} from "./share";

// Sample data
const studentList: Student[] = [
  new Student("1", "吴山茶", 20, "Male", 80),
  new Student("2", "孙菖蒲", 21, "Female", 85),
  new Student("3", "冯桃花", 22, "Male", 75),
];

const studentGroupList: StudentGroup[] = [
  new StudentGroup("11", "茉莉", [1, 2]),
  new StudentGroup("12", "香菊", [2, 3]),
];

export default function RollCall() {
  const dataList: MixedData[] = useMemo(
    () => [...studentList, ...studentGroupList],
    [],
  );
  const [selectedDataList, setSelectedDataList] = useState<MixedData[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isLockMode, setIsLockMode] = useState(false);
  const [lockedOperation, setLockedOperation] = useState<
    OperationConfig<MixedData>["key"] | null
  >(null);

  /** 操作模式切换 */
  const handleSelectOperation = (val: string) => {
    setIsLockMode(val === "lock-mode");
    setLockedOperation(null);
  };
  /** 多选切换 */
  const handleToggleMultiSelect = (val: boolean) => {
    setIsMultiSelect(val);
    setSelectedDataList([]);
  };

  /** 选择数据 */
  const handleSelect = (data: MixedData) => {
    if (isMultiSelect) {
      setSelectedDataList((prev) =>
        prev.includes(data) ? prev.filter((d) => d !== data) : [...prev, data],
      );
    } else {
      if (data === selectedDataList[0]) {
        setSelectedDataList([]);
      } else {
        setSelectedDataList([data]);
      }
    }
  };

  /** 操作数据 */
  const handleAction = (data: MixedData) => {
    const action = operationConfigs.find(
      (config) => config.key === lockedOperation,
    )?.action;
    action?.(data);
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
              <SelectOperations
                isLockMode={isLockMode}
                allDataList={dataList}
                selectedDataList={selectedDataList}
                setSelectedDataList={setSelectedDataList}
                isMultiSelect={isMultiSelect}
                handleToggleMultiSelect={handleToggleMultiSelect}
              />

              <Separator orientation="vertical" />
            </>
          )}

          {/* 操作列表 */}
          <DataOperations
            isLockMode={isLockMode}
            operationConfigs={operationConfigs}
            selectedDataList={selectedDataList}
            lockedOperation={lockedOperation}
            setLockedOperation={setLockedOperation}
          />
        </div>

        {/* 数据列表 */}
        <DataList
          dataList={dataList}
          selectedDataList={selectedDataList}
          onSelect={handleSelect}
          onAction={handleAction}
          isLockMode={isLockMode}
          lockedOperation={lockedOperation}
        />
      </div>
    </div>
  );
}
