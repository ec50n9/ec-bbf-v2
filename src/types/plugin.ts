import type {
  BaseDataType,
  OperationConfig,
} from "@/components/share/ec-data-list";

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

export interface EcPlugin<T extends BaseDataType> {
  dataProvider?: EcDataProvider;
  dataSelector?: EcDataSelector<T>;
  actions?: OperationConfig<T>[];
  dataView?: { component: React.FC };
}
