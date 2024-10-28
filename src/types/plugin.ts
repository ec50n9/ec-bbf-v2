import type { IconType } from "react-icons/lib";

export type BaseDataType = {
  id: number;
  name: string;
};

export interface EcDataProvider {
  id: string;
  name: string;
  component: React.FC;
  onInit: () => void;
}

export interface EcDataSelector<T extends BaseDataType> {
  id: string;
  name: string;
  component: React.FC;
  onItemClick: (data: T) => void;
}

export type Constructor<T extends BaseDataType> = new (...args: any[]) => T;

/** T: 支持的数据类型的构造对象，M: 数据类型 */
export interface ActionConfig<
  M extends BaseDataType,
  T extends Constructor<M> = Constructor<M>,
  A = Record<string, any>
> {
  key: string;
  label: string;
  icon?: IconType;
  supportedTypes?: T[];
  argsResolver?: () => A | Promise<A>;
  action: (data: M, args?: A) => void;
}

/** 详情信息视图 */
export interface InfoView<
  T extends BaseDataType,
  C extends Constructor<T> = Constructor<T>
> {
  supportedTypes: C;
  component: React.FC<{ data: T }>;
}

export interface EcPlugin<T extends BaseDataType> {
  dataProvider?: EcDataProvider;
  dataSelector?: EcDataSelector<T>;
  actions?: ActionConfig<T>[];
  infoViews?: InfoView<T>[];
}
