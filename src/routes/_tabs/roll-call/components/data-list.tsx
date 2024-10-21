import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import CommonItem from "../items/common-item";
import {
  useManualSelectorStore,
  useStudentStore,
} from "@/stores/student-store";
import type { MixedData } from "@/services/types";
import type { Constructor } from "@/components/share/ec-data-list/share";

export default function DataList() {
  /** 数据列表动画 */
  const [dataListParent, enableDataListAnimations] = useAutoAnimate();
  enableDataListAnimations(true);

  const dataList = useStudentStore((s) => s.allDataList);
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const lockedOperation = useStudentStore((s) => s.lockedOperation());
  const supportOperationTypesSet = new Set(lockedOperation?.supportedTypes);
  const selectedDataSet = new Set(useStudentStore((s) => s.selectedDataList));
  const onSelect = useManualSelectorStore((s) => s.onSelect);

  const handleOnClick = (data: MixedData) => {
    if (isLockMode) lockedOperation?.action?.(data);
    else onSelect(data);
  };

  return (
    <div ref={dataListParent} className="grid grid-cols-5 gap-3">
      {dataList
        .filter(
          (item) =>
            !isLockMode ||
            supportOperationTypesSet.has(
              item.constructor as Constructor<MixedData>,
            ),
        )
        .map((item) => {
          const isSelected = !isLockMode && selectedDataSet.has(item);
          return (
            <div
              key={item.id}
              onClick={() => handleOnClick(item)}
              onKeyDown={(e) => {
                e.key === "Enter" && handleOnClick(item);
              }}
              className={cn(
                "rounded-lg cursor-pointer",
                "transform transition-all duration-300 ease-in-out",
                "outline outline-0 outline-offset-2 outline-ring",
                !isLockMode &&
                  selectedDataSet.has(item) &&
                  "scale-90 outline-4",
              )}
            >
              <CommonItem
                data={item}
                isDisabled={false}
                isSelected={isSelected}
                onClick={() => {}}
              />
            </div>
          );
        })}
    </div>
  );
}
