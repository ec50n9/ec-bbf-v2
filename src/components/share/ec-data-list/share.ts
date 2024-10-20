import type { IconType } from "react-icons/lib";

export type BaseDataType = {
  id: string;
  name: string;
};

export type Constructor<T extends BaseDataType> = new (...args: any[]) => T;

/** T: 支持的数据类型的构造对象，M: 数据类型 */
export interface OperationConfig<
  M extends BaseDataType,
  T extends Constructor<M> = Constructor<M>,
> {
  key: string;
  label: string;
  icon: IconType;
  supportedTypes: T[];
  action: (data: M) => void;
}
