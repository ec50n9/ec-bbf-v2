import type { BaseDataType, Constructor, OperationConfig } from "./share";

interface ActionListProps<M extends BaseDataType> {
  operationConfigs: OperationConfig<M>[];
  selectedDataList: M[];
  isOperationLocked: boolean;
  lockedOperation: OperationConfig<M>["key"] | null;
  selectOperation: (key: OperationConfig<M>["key"]) => void;
}

export interface ActionItemProps<M extends BaseDataType>
  extends ActionListProps<M> {
  supportedActions: OperationConfig<M>[];
}

export default function ActionList<M extends BaseDataType>(
  props: ActionListProps<M> & {
    children?: (actionList: ActionItemProps<M>) => React.ReactNode;
  },
) {
  const { operationConfigs = [], selectedDataList = [], children } = props;

  const selectedDataTypes = selectedDataList.map(
    (item) => item.constructor as Constructor<M>,
  );
  const supportedActions = operationConfigs.filter((config) =>
    selectedDataTypes.every((type) => config.supportedTypes.includes(type)),
  );

  return children?.({ ...props, supportedActions });
}
