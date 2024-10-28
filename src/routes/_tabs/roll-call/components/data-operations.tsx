import type { Constructor, ActionConfig } from "@/types/plugin";
import { Button } from "@/components/ui/button";
import type { MixedData } from "@/services/types";
import { usePluginStore } from "@/stores/plugin-store";
import { useStudentStore } from "@/stores/student-store";

/** 操作列表 */
export default function DataOperations() {
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const lockedOperationKey = useStudentStore((s) => s.lockedOperationKey);
  const selectedDataList = useStudentStore((s) => s.selectedDataList);
  const actions = usePluginStore((s) => s.actions);
  const updateLockedOperationKey = useStudentStore(
    (s) => s.updateLockedOperationKey
  );
  const updateLockedOperationArgs = useStudentStore(
    (s) => s.updateLockedOperationArgs
  );

  const selectedDataTypes = selectedDataList.map(
    (i) => i.constructor as Constructor<MixedData>
  );
  const supportedActions = isLockMode
    ? actions.filter((c) => c.supportedTypes)
    : actions.filter(
        (c) =>
          !c.supportedTypes ||
          selectedDataTypes.every((t) => c.supportedTypes?.includes(t))
      );
  const handleOnClick = async (action: ActionConfig<MixedData>) => {
    if (isLockMode) {
      updateLockedOperationKey(action.key);
      const args = await action.argsResolver?.();
      updateLockedOperationArgs(args);
    } else {
      const args = await action.argsResolver?.();
      selectedDataList.map((data) => action.action(data, args));
    }
  };

  return (
    <>
      {isLockMode && !lockedOperationKey && (
        <div className="shrink-0 flex items-center gap-3">
          请先选择一个操作 👉
        </div>
      )}
      {supportedActions.map((action) => {
        const isLocked = lockedOperationKey === action.key;

        return (
          <Button
            key={action.key}
            size="sm"
            variant={!isLockMode ? "outline" : isLocked ? "default" : "ghost"}
            onClick={() => handleOnClick(action)}
            disabled={!isLockMode && selectedDataList.length === 0}
          >
            {action.icon && <action.icon className="size-4" />}
            {action.label}
          </Button>
        );
      })}
    </>
  );
}
