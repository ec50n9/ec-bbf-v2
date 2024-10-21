import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMemo } from "react";
import type { MixedData } from "../share";

/** 选择操作 */
export default function SelectOperations(props: {
  isLockMode: boolean;
  allDataList: MixedData[];
  selectedDataList: MixedData[];
  setSelectedDataList: (val: MixedData[]) => void;
  isMultiSelect: boolean;
  handleToggleMultiSelect: (val: boolean) => void;
}) {
  const {
    isLockMode,
    allDataList,
    selectedDataList,
    setSelectedDataList,
    isMultiSelect,
    handleToggleMultiSelect,
  } = props;

  const isAllSelected = useMemo(() => {
    return selectedDataList.length === allDataList.length;
  }, [selectedDataList, allDataList]);

  /** 全选切换 */
  const handleToggleAllSelect = () => {
    if (isAllSelected) {
      setSelectedDataList([]);
    } else {
      setSelectedDataList([...allDataList]);
    }
  };

  /** 反选 */
  const handleReverseSelect = () => {
    setSelectedDataList(
      allDataList.filter((item) => !selectedDataList.includes(item)),
    );
  };

  return (
    <>
      {/* 选择模式 */}
      <Select defaultValue="manual">
        <SelectTrigger className="w-24">
          <SelectValue placeholder="选择模式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">手动</SelectItem>
          <SelectItem value="random">随机</SelectItem>
        </SelectContent>
      </Select>
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
          {!!selectedDataList.length && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedDataList([]);
              }}
            >
              取消选择
            </Button>
          )}
          {/* 全(不)选 */}
          <Button size="sm" variant="outline" onClick={handleToggleAllSelect}>
            {isAllSelected ? "全不选" : "全选"}
          </Button>
          {/* 反选 */}
          <Button size="sm" variant="outline" onClick={handleReverseSelect}>
            反选
          </Button>
        </>
      )}
    </>
  );
}
