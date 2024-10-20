import type { BaseDataType, Constructor, OperationConfig } from "./share";
import { Button } from "@/components/ui/button";

interface ActionListProps<M extends BaseDataType> {
  operationConfigs: OperationConfig<M>[];
  selectedDataList: M[];
  isOperationLocked: boolean;
  lockedOperation: OperationConfig<M>["key"] | null;
  selectOperation: (key: OperationConfig<M>["key"]) => void;
}

export default function ActionList<M extends BaseDataType>({
  operationConfigs = [],
  selectedDataList = [],
  isOperationLocked = false,
  lockedOperation = null,
  selectOperation,
}: ActionListProps<M>) {
  const selectedDataTypes = selectedDataList.map(
    (item) => item.constructor as Constructor<M>,
  );
  const supportedActions = operationConfigs.filter((config) =>
    selectedDataTypes.every((type) => config.supportedTypes.includes(type)),
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {supportedActions.map((config) => (
          <Button
            key={config.key}
            variant={
              !isOperationLocked
                ? "outline"
                : lockedOperation === config.key
                  ? "default"
                  : "ghost"
            }
            onClick={() => {
              isOperationLocked
                ? selectOperation(config.key)
                : selectedDataList.map(config.action);
            }}
          >
            <config.icon className="h-5 w-5" />
            {config.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
