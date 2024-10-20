import { useState, useMemo } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Header from "@/components/share/header";
import {
  ActionList,
  DataList,
  type OperationConfig,
  type DataItemProps,
} from "@/components/share/ec-data-list";
import {
  Student,
  StudentGroup,
  type MixedData,
  operationConfigs,
} from "./share";
import StudentItem from "./items/student-item";
import StudentGroupItem from "./items/student-group-item";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LuMoveRight } from "react-icons/lu";

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

  const isAllSelected = useMemo(() => {
    return selectedDataList.length === dataList.length;
  }, [selectedDataList, dataList]);

  /** 全选切换 */
  const handleToggleAllSelect = () => {
    if (isAllSelected) {
      setSelectedDataList([]);
    } else {
      setSelectedDataList([...dataList]);
    }
  };
  /** 反选 */
  const handleReverseSelect = () => {
    setSelectedDataList(
      dataList.filter((item) => !selectedDataList.includes(item)),
    );
  };

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
  /** 数据列表动画 */
  const [dataListParent, enableDataListAnimations] = useAutoAnimate();
  enableOperationListAnimations(true);
  enableDataListAnimations(true);

  return (
    <div className="h-full grid grid-rows-[auto_1fr] px-2">
      <Header title="点名">
        <div className="flex items-center space-x-4">
          <Select defaultValue="normal" onValueChange={handleSelectOperation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择操作模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>操作模式</SelectLabel>
                <SelectItem value="normal">普通模式</SelectItem>
                <SelectItem value="lock-mode">锁定操作模式</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Header>

      <div className="mt-3 flex flex-col gap-3">
        {/* 搜索项 */}
        <div className="flex items-center gap-4 bg-[#f1e8e1] p-3 rounded-xl">
          <Select>
            <SelectTrigger className="w-48 bg-white">
              <SelectValue placeholder="选择数据类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="student">仅学生</SelectItem>
              <SelectItem value="student-group">仅分组</SelectItem>
            </SelectContent>
          </Select>

          <Input className="w-48 bg-white" placeholder="输入关键词搜索" />

          <Button size="sm" variant="default">
            筛选
          </Button>
        </div>

        {/* 操作列表 */}
        <div ref={operationListParent} className="flex items-center gap-3">
          {!isLockMode && (
            <>
              {/* 单/多选 */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  checked={isMultiSelect}
                  onCheckedChange={handleToggleMultiSelect}
                  disabled={isLockMode}
                />
                <Label htmlFor="airplane-mode">多选</Label>
              </div>
              {isMultiSelect && (
                <>
                  {/* 清空选择 */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDataList([]);
                    }}
                  >
                    取消选择
                  </Button>
                  {/* 全(不)选 */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleToggleAllSelect}
                  >
                    {isAllSelected ? "全不选" : "全选"}
                  </Button>
                  {/* 反选 */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReverseSelect}
                  >
                    反选
                  </Button>

                  <Separator orientation="vertical" />
                </>
              )}
            </>
          )}

          {/* 操作列表 */}
          <ActionList
            operationConfigs={operationConfigs}
            selectedDataList={selectedDataList}
            isLockMode={isLockMode}
            lockedOperation={lockedOperation}
            selectOperation={setLockedOperation}
          >
            {(actionWrapperList) => (
              <>
                {isLockMode && !lockedOperation && (
                  <div className="flex items-center gap-3">
                    请先选择一个操作 👉
                  </div>
                )}
                {actionWrapperList.map((actionWrapper) => (
                  <Button
                    key={actionWrapper.action.key}
                    size="sm"
                    variant={
                      !isLockMode
                        ? "outline"
                        : actionWrapper.isLocked
                          ? "default"
                          : "ghost"
                    }
                    onClick={actionWrapper.onClick}
                    disabled={!isLockMode && selectedDataList.length === 0}
                  >
                    <actionWrapper.action.icon className="size-4" />
                    {actionWrapper.action.label}
                  </Button>
                ))}
              </>
            )}
          </ActionList>
        </div>

        {/* 数据列表 */}
        <DataList
          dataList={dataList}
          selectedDataList={selectedDataList}
          onSelect={handleSelect}
          onAction={handleAction}
          isLockMode={isLockMode}
          supportOperationTypes={
            operationConfigs.find((config) => config.key === lockedOperation)
              ?.supportedTypes ?? []
          }
        >
          {(dataList) => (
            <div ref={dataListParent} className="grid grid-cols-5 gap-3">
              {dataList
                .filter((item) => !item.isDisabled)
                .map((item) => (
                  <div
                    key={item.data.id}
                    onClick={item.onClick}
                    onKeyDown={(e) => {
                      e.key === "Enter" && item.onClick();
                    }}
                    className={cn(
                      "rounded-lg  transform transition-all duration-300 ease-in-out",
                      "outline outline-0 outline-offset-0 outline-blue-200",
                      item.isSelected && "scale-90 outline-8",
                    )}
                  >
                    <DataItemView {...item} />
                  </div>
                ))}
            </div>
          )}
        </DataList>
      </div>
    </div>
  );
}

function DataItemView({ data, isDisabled }: DataItemProps<MixedData>) {
  if (data instanceof Student) {
    return <StudentItem data={data} />;
  }
  if (data instanceof StudentGroup) {
    return <StudentGroupItem data={data} />;
  }
}
