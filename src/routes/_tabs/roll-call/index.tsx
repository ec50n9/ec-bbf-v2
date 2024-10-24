import { useAutoAnimate } from "@formkit/auto-animate/react";
import DataOperations from "./components/data-operations";
import TitleBar from "./components/title-bar";
import DataList from "./components/data-list";
import { operationConfigs } from "./share";
import { useStudentStore } from "@/stores/student-store";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ManualSelector,
  useManualSelectorStore,
} from "./selectors/manual-selector";
import {
  RandomSelector,
  useRandomSelectorStore,
} from "./selectors/random-selector";
import EcCard from "@/components/share/ec-card";
import {
  DbProvider,
  dbProviderActions,
  useDbProviderStore,
} from "./providers/db-provider";

const dataProviders = {
  db: {
    name: "数据库",
    component: DbProvider,
    initData: useDbProviderStore.getState().initData,
  },
};

const dataSelectors = {
  manual: {
    name: "手动",
    component: ManualSelector,
    onSelect: useManualSelectorStore.getState().onSelect,
  },
  random: {
    name: "随机",
    component: RandomSelector,
    onSelect: useRandomSelectorStore.getState().onSelect,
  },
};

export default function RollCall() {
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const updateIsLockMode = useStudentStore((s) => s.updateIsLockMode);
  const updateOperationConfigs = useStudentStore(
    (s) => s.updateOperationConfigs,
  );
  const updateSelectedDataList = useStudentStore(
    (s) => s.updateSelectedDataList,
  );

  useEffect(() => {
    dataProvider.initData();
    updateOperationConfigs([...dbProviderActions, ...operationConfigs]);
  }, []);

  /** 操作模式切换 */
  const handleSelectOperation = (val: string) => {
    updateIsLockMode(val === "lock-mode");
  };

  /** 操作栏动画 */
  const [operationListParent, enableOperationListAnimations] = useAutoAnimate();
  useEffect(() => {
    enableOperationListAnimations(true);
  }, []);

  // #region 数据提供器
  const [providerType, setProviderType] =
    useState<keyof typeof dataProviders>("db");
  const dataProvider = useMemo(() => {
    return dataProviders[providerType];
  }, [providerType]);
  // #endregion

  // #region 选择模式
  const [selectMode, setSelectMode] =
    useState<keyof typeof dataSelectors>("manual");
  const selector = useMemo(() => {
    return dataSelectors[selectMode];
  }, [selectMode]);

  // 切换选择模式时清空选择列表
  useEffect(() => {
    updateSelectedDataList([]);
  }, [selectMode, updateSelectedDataList]);
  // #endregion

  return (
    <div className="h-full grid grid-rows-[auto_1fr] px-2">
      <TitleBar handleSelectOperation={handleSelectOperation} />
      <div className="mt-3 flex flex-col gap-3">
        {/* 操作列表 */}
        <div
          ref={operationListParent}
          className="flex flex-wrap items-center gap-3"
        >
          {/* 搜索项 */}
          <EcCard title="筛选">
            {/* 选择模式 */}
            {/* <Select
            defaultValue="db"
            value={providerType}
            onValueChange={setProviderType}
          >
            <SelectTrigger className="shrink-0 w-24">
              <SelectValue placeholder="数据来源" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(dataProviders).map((key) => (
                <SelectItem key={key} value={key}>
                  {dataProviders[key].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

            <dataProvider.component />
          </EcCard>

          {/* 选择操作 */}
          {!isLockMode && (
            <EcCard title="数据选择">
              {/* 选择模式 */}
              <Select
                defaultValue="manual"
                value={selectMode}
                onValueChange={setSelectMode}
              >
                <SelectTrigger className="shrink-0 w-24">
                  <SelectValue placeholder="选择模式" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(dataSelectors).map((key) => (
                    <SelectItem key={key} value={key}>
                      {dataSelectors[key].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <selector.component />
            </EcCard>
          )}

          {/* 数据操作 */}
          <EcCard title="数据操作">
            <DataOperations />
          </EcCard>
        </div>
        {/* 数据列表 */}
        <DataList onSelect={selector.onSelect} />
      </div>
    </div>
  );
}
