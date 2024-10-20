import type { BaseDataType, Constructor } from "./share";

interface DataListProps<
  T extends BaseDataType,
  C extends Constructor<T> = Constructor<T>,
> {
  dataList: T[];
  selectedDataList: T[];
  onSelect: (data: T) => void;
  onAction: (data: T) => void;
  isOperationLocked: boolean;
  supportOperationTypes: C[];
  children?: (dataList: DataItemProps<T>[]) => React.ReactNode;
}

export interface DataItemProps<T extends BaseDataType> {
  data: T;
  isSelected: boolean;
  onClick: () => void;
  isDisabled: boolean;
}

export default function DataList<T extends BaseDataType>({
  dataList = [],
  selectedDataList = [],
  onSelect,
  onAction,
  isOperationLocked = false,
  supportOperationTypes = [],
  children,
}: DataListProps<T>) {
  const selectedDataSet = new Set(selectedDataList);
  const supportOperationTypesSet = new Set(supportOperationTypes);

  const newDataList: DataItemProps<T>[] = dataList.map((data) => {
    const isSelected = !isOperationLocked && selectedDataSet.has(data);
    return {
      data,
      isSelected,
      onClick: () => {
        isOperationLocked ? onAction(data) : onSelect(data);
      },
      isDisabled:
        isOperationLocked &&
        !supportOperationTypesSet.has(data.constructor as Constructor<T>),
    };
  });

  return children?.(newDataList);
}
