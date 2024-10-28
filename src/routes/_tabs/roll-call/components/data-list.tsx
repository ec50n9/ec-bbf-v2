import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import CommonItem from "../items/common-item";
import { useStudentStore } from "@/stores/student-store";
import type { MixedData } from "@/services/types";
import type { Constructor } from "@/types/plugin";
import { useEffect } from "react";

export default function DataList(props: {
  onSelect: (data: MixedData) => void;
}) {
  /** 数据列表动画 */
  const [dataListParent, enableDataListAnimations] = useAutoAnimate();
  useEffect(() => {
    enableDataListAnimations(true);
  }, []);

  const dataList = useStudentStore((s) => s.allDataList);
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const lockedOperation = useStudentStore((s) => s.lockedOperation());
  const lockedOperationArgs = useStudentStore((s) => s.lockedOperationArgs);
  const supportOperationTypesSet = new Set(lockedOperation?.supportedTypes);
  const selectedDataSet = new Set(useStudentStore((s) => s.selectedDataList));

  const handleOnClick = async (data: MixedData) => {
    if (isLockMode) {
      lockedOperation?.action?.(data, lockedOperationArgs);
    } else props.onSelect(data);
  };

  return (
    <div ref={dataListParent} className="grid grid-cols-5 gap-3">
      {dataList
        .filter(
          (item) =>
            !isLockMode ||
            supportOperationTypesSet.has(
              item.constructor as Constructor<MixedData>
            )
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
                  "scale-90 outline-4 z-10"
              )}
            >
              <CommonItem
                data={item}
                isDisabled={false}
                isSelected={isSelected}
              />
            </div>
          );
        })}
    </div>
  );
}
