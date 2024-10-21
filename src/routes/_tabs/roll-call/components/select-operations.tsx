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
import {
  useManualSelectorStore,
  useStudentStore,
} from "@/stores/student-store";

/** 选择操作 */
export default function SelectOperations() {
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
}
