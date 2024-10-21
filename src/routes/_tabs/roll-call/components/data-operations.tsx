import type { Constructor } from "@/components/share/ec-data-list/share";
import { Button } from "@/components/ui/button";
import type { MixedData } from "@/services/types";
import { useStudentStore } from "@/stores/student-store";

/** 操作列表 */
export default function DataOperations() {
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const lockedOperationKey = useStudentStore((s) => s.lockedOperationKey);
  const selectedDataList = useStudentStore((s) => s.selectedDataList);
  const operationConfigs = useStudentStore((s) => s.operationConfigs);
  const updateLockedOperationKey = useStudentStore(
    (s) => s.updateLockedOperationKey,
  );

  // const selectedDateTypes = useStudentStore((s) => s.selectedDataTypes());
  // const supportedActions = useStudentStore((s) => s.supportedActions());

  const selectedDataTypes = selectedDataList.map(
    (i) => i.constructor as Constructor<MixedData>,
  );
  const supportedActions = operationConfigs.filter((c) =>
    selectedDataTypes.every((t) => c.supportedTypes.includes(t)),
  );

  return (
    <>
      {isLockMode && !lockedOperationKey && (
        <div className="flex items-center gap-3">请先选择一个操作 👉</div>
      )}
      {supportedActions.map((action) => {
        const isLocked = lockedOperationKey === action.key;
        const handleOnClick = () =>
          isLockMode
            ? updateLockedOperationKey(action.key)
            : selectedDataList.map(action.action);

        return (
          <Button
            key={action.key}
            size="sm"
            variant={!isLockMode ? "outline" : isLocked ? "default" : "ghost"}
            onClick={handleOnClick}
            disabled={!isLockMode && selectedDataList.length === 0}
          >
            <action.icon className="size-4" />
            {action.label}
          </Button>
        );
      })}
    </>
  );
}
