import type { BaseDataType, Constructor, OperationConfig } from "./share";

interface ActionListProps<M extends BaseDataType> {
  operationConfigs: OperationConfig<M>[];
  selectedDataList: M[];
  isLockMode: boolean;
  lockedOperation: OperationConfig<M>["key"] | null;
  selectOperation: (key: OperationConfig<M>["key"]) => void;
  children: (actionItemList: ActionItemProps<M>[]) => React.ReactNode;
}

export interface ActionItemProps<M extends BaseDataType> {
  action: OperationConfig<M>;
  isLocked: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function ActionList<M extends BaseDataType>({
  operationConfigs = [],
  selectedDataList = [],
  isLockMode,
  lockedOperation,
  selectOperation,
  children,
}: ActionListProps<M>) {
  /** 当前选中的所有数据的类型 */
  const selectedDataTypes = selectedDataList.map(
    (item) => item.constructor as Constructor<M>,
  );
  /** 当前支持的操作类型 */
  const supportedActions = operationConfigs.filter((config) =>
    selectedDataTypes.every((type) => config.supportedTypes.includes(type)),
  );

  const actionWrapperList: ActionItemProps<M>[] = supportedActions.map((action) => {
    return {
      action,
      isLocked: lockedOperation === action.key,
      disabled: !isLockMode && selectedDataList.length === 0,
      onClick: () =>
        isLockMode
          ? selectOperation(action.key)
          : selectedDataList.map(action.action),
    };
  });

  return children(actionWrapperList);
}
