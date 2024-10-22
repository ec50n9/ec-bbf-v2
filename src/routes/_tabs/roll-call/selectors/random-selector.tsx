import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MixedData } from "@/services/types";
import { useStudentStore } from "@/stores/student-store";
import { useEffect, useMemo, useState } from "react";
import { create } from "zustand";

type RandomSelectorState = {
  onSelect: (data: MixedData) => void;
};

export const useRandomSelectorStore = create<RandomSelectorState>(
  (set, get) => ({
    onSelect: (data: MixedData) => {
      console.log("当前处于随机选择模式，不可以选择");
    },
  }),
);

export const RandomSelector = () => {
  const allDataList = useStudentStore((s) => s.allDataList);
  const updateSelectedDataList = useStudentStore(
    (s) => s.updateSelectedDataList,
  );

  /** 同一个对象可重复选择 */
  const [isRepeat, setIsRepeat] = useState(false);
  /** 选择数量 */
  const [count, setCount] = useState(1);

  const [localSelectedList, setLocalSelectedList] = useState(
    new Set<MixedData>(),
  );
  const unselectedList = useMemo(
    () => allDataList.filter((item) => !localSelectedList.has(item)),
    [allDataList, localSelectedList],
  );
  const targetList = useMemo(
    () => (isRepeat ? allDataList : unselectedList),
    [allDataList, isRepeat, unselectedList],
  );

  const handleReset = () => {
    updateSelectedDataList([]);
    setLocalSelectedList(new Set<MixedData>());
  };
  // 当重复选择开关变化时，重置选择列表
  useEffect(handleReset, [isRepeat]);

  const handleRandomSelect = () => {
    // 无数据可选，直接返回
    if (targetList.length === 0) return;

    // 随机选择 count 个数据
    const selectedDataList = new Set<MixedData>();
    for (let i = 0; i < count; i++) {
      const _targetList = targetList.filter(
        (item) => !selectedDataList.has(item),
      );

      if (_targetList.length === 0) break;

      const randomIndex = Math.floor(Math.random() * _targetList.length);
      const randomData = _targetList[randomIndex];
      selectedDataList.add(randomData);

      // 更新本地选择列表
      setLocalSelectedList((prevList) => {
        const newList = new Set(prevList);
        newList.add(randomData);
        return newList;
      });
    }

    // 更新选择的数据列表
    updateSelectedDataList([...selectedDataList]);
  };

  return (
    <>
      <Button size="default" variant="outline" onClick={handleReset}>
        重置
      </Button>
      <div className="flex items-center space-x-2">
        <Switch
          id="is-repeat"
          checked={isRepeat}
          onCheckedChange={setIsRepeat}
        />
        <Label htmlFor="is-repeat">可重复</Label>
      </div>
      <Input
        className="w-20"
        min={1}
        max={targetList.length}
        type="number"
        placeholder="个数"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
      />
      <Button
        size="default"
        variant="outline"
        disabled={targetList.length === 0}
        onClick={handleRandomSelect}
      >
        随机选择
      </Button>
    </>
  );
};
