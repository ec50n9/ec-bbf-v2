import type { OperationConfig } from "@/components/share/ec-data-list";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import CommonItem from "../items/common-item";
import { type MixedData, operationConfigs } from "../share";
import { DataList as EcDataList } from "@/components/share/ec-data-list";

export default function DataList(props: {
  dataList: MixedData[];
  selectedDataList: MixedData[];
  onSelect: (data: MixedData) => void;
  onAction: (data: MixedData) => void;
  isLockMode: boolean;
  lockedOperation: OperationConfig<MixedData>["key"] | null;
}) {
  const {
    dataList,
    selectedDataList,
    onSelect,
    onAction,
    isLockMode,
    lockedOperation,
  } = props;

  /** 数据列表动画 */
  const [dataListParent, enableDataListAnimations] = useAutoAnimate();
  enableDataListAnimations(true);

  return (
    <EcDataList
      dataList={dataList}
      selectedDataList={selectedDataList}
      onSelect={onSelect}
      onAction={onAction}
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
                  "rounded-lg cursor-pointer",
                  "transform transition-all duration-300 ease-in-out",
                  "outline outline-0 outline-offset-2 outline-ring",
                  item.isSelected && "scale-90 outline-4",
                )}
              >
                <CommonItem {...item} />
              </div>
            ))}
        </div>
      )}
    </EcDataList>
  );
}
