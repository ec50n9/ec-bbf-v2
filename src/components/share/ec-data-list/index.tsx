import { useState, useMemo } from "react";
import { LuPlus, LuMinus, LuTrash } from "react-icons/lu";
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

import type { BaseDataType, OperationConfig } from "./share";
import ActionList from "./action-list";
import DataList from "./data-list";

class Student implements BaseDataType {
  constructor(
    public id: string,
    public name: string,
    public age: number,
    public gender: "Male" | "Female",
    public score: number,
  ) {}
}

class StudentGroup implements BaseDataType {
  constructor(
    public id: string,
    public name: string,
    public studentIds: number[],
  ) {}
}

class ExamGroup implements BaseDataType {
  constructor(
    public id: string,
    public name: string,
    public studentIds: number[],
  ) {}
}

type MixedData = Student | StudentGroup | ExamGroup;

// Sample data
const studentList: Student[] = [
  new Student("1", "John", 20, "Male", 80),
  new Student("2", "Jane", 21, "Female", 85),
  new Student("3", "Bob", 22, "Male", 75),
];

const studentGroupList: StudentGroup[] = [
  new StudentGroup("11", "Group 1", [1, 2]),
  new StudentGroup("12", "Group 2", [2, 3]),
];

const examGroupList: ExamGroup[] = [
  new ExamGroup("21", "Math Exam", [1, 2, 3]),
  new ExamGroup("22", "Science Exam", [1, 3]),
];

const operationConfigs: OperationConfig<MixedData>[] = [
  {
    key: "delete",
    label: "删除(s|g|e)",
    icon: LuTrash,
    supportedTypes: [Student, StudentGroup, ExamGroup],
    action: (data) => {
      // Implement delete logic here
      console.log(`Deleting ${data.name}`);
    },
  },
  {
    key: "addScore",
    label: "加分(s|g)",
    icon: LuPlus,
    supportedTypes: [Student, StudentGroup],
    action: (data) => {
      console.log(`Adding score to ${data.name}`);
    },
  },
  {
    key: "subtractScore",
    label: "扣分(s|g)",
    icon: LuMinus,
    supportedTypes: [Student, StudentGroup],
    action: (data) => {
      console.log(`Subtracting score from ${data.name}`);
    },
  },
];

export default function EcDataList() {
  const dataList: MixedData[] = useMemo(
    () => [...studentList, ...studentGroupList, ...examGroupList],
    [],
  );
  const [selectedDataList, setSelectedDataList] = useState<MixedData[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isOperationLocked, setIsOperationLocked] = useState(false);
  const [lockedOperation, setLockedOperation] = useState<
    OperationConfig<MixedData>["key"] | null
  >(null);

  const handleSelectOperation = (val: string) => {
    setIsOperationLocked(val === "lock-mode");
    setLockedOperation(null);
  };
  const handleToggleMultiSelect = (val: boolean) => {
    setIsMultiSelect(val);
    setSelectedDataList([]);
  };

  const handleSelect = (data: MixedData) => {
    if (isMultiSelect) {
      setSelectedDataList((prev) =>
        prev.includes(data) ? prev.filter((d) => d !== data) : [...prev, data],
      );
    } else {
      setSelectedDataList([data]);
    }
  };

  const handleAction = (data: MixedData) => {
    const action = operationConfigs.find(
      (config) => config.key === lockedOperation,
    )?.action;
    action?.(data);
  };

  return (
    <div className="p-4">
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
        {/* 多选开关 */}
        {!isOperationLocked && (
          <div className="flex items-center space-x-2">
            <Switch
              id="airplane-mode"
              checked={isMultiSelect}
              onCheckedChange={handleToggleMultiSelect}
              disabled={isOperationLocked}
            />
            <Label htmlFor="airplane-mode">多选</Label>
          </div>
        )}
      </div>
      {/* 已选择列表 */}
      {!isOperationLocked && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            已选择: {selectedDataList.length}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {selectedDataList.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </>
      )}
      {/* 操作列表 */}
      <ActionList
        operationConfigs={operationConfigs}
        selectedDataList={selectedDataList}
        isOperationLocked={isOperationLocked}
        lockedOperation={lockedOperation}
        selectOperation={setLockedOperation}
      />
      {/* 数据列表 */}
      <DataList
        dataList={dataList}
        selectedDataList={selectedDataList}
        onSelect={handleSelect}
        onAction={handleAction}
        isOperationLocked={isOperationLocked}
        supportOperationTypes={
          operationConfigs.find((config) => config.key === lockedOperation)
            ?.supportedTypes ?? []
        }
      >
        {(dataList) => (
          <div>
            {dataList
              .filter((item) => !item.isDisabled)
              .map((item) => (
                <div key={item.data.id} onClick={item.onClick}>
                  {item.data.name}
                </div>
              ))}
          </div>
        )}
      </DataList>
    </div>
  );
}
