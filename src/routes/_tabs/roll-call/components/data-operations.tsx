import {
  type OperationConfig,
  ActionList,
} from "@/components/share/ec-data-list";
import { Button } from "@/components/ui/button";
import type { MixedData } from "../share";

/** 操作列表 */
export default function DataOperations(props: {
  isLockMode: boolean;
  operationConfigs: OperationConfig<MixedData>[];
  selectedDataList: MixedData[];
  lockedOperation: OperationConfig<MixedData>["key"] | null;
  setLockedOperation: (key: OperationConfig<MixedData>["key"]) => void;
}) {
  const {
    isLockMode,
    operationConfigs,
    selectedDataList,
    lockedOperation,
    setLockedOperation,
  } = props;

  return (
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
            <div className="flex items-center gap-3">请先选择一个操作 👉</div>
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
  );
}
