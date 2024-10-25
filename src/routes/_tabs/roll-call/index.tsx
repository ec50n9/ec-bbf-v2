import { useAutoAnimate } from "@formkit/auto-animate/react";
import DataOperations from "./components/data-operations";
import TitleBar from "./components/title-bar";
import DataList from "./components/data-list";
import { useStudentStore } from "@/stores/student-store";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EcCard from "@/components/share/ec-card";
import { usePluginStore } from "@/stores/plugin-store";

export default function RollCall() {
  const isLockMode = useStudentStore((s) => s.isLockMode);
  const updateIsLockMode = useStudentStore((s) => s.updateIsLockMode);
  const updateSelectedDataList = useStudentStore(
    (s) => s.updateSelectedDataList,
  );

  const dataProviders = usePluginStore((s) => s.providers);
  const dataSelectors = usePluginStore((s) => s.selectors);

  const currentProviderId = usePluginStore((s) => s.currentProviderId);
  const setCurrentProviderId = usePluginStore((s) => s.selectProvider);
  const currentSelectorId = usePluginStore((s) => s.currentSelectorId);
  const setCurrentSelectorId = usePluginStore((s) => s.selectSelector);

  const currentProvider = usePluginStore((s) => s.currentProvider());
  const currentSelector = usePluginStore((s) => s.currentSelector());

  useEffect(() => {
    // 数据提供器的初始化
    currentProvider?.onInit?.();
  }, [currentProvider]);

  /** 操作模式切换 */
  const handleSelectOperation = (val: string) => {
    updateIsLockMode(val === "lock-mode");
  };

  /** 操作栏动画 */
  const [operationListParent, enableOperationListAnimations] = useAutoAnimate();
  useEffect(() => {
    enableOperationListAnimations(true);
  }, []);

  // 切换选择模式时清空选择列表
  useEffect(() => {
    updateSelectedDataList([]);
  }, [currentSelectorId, updateSelectedDataList]);
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
            <Select
              value={currentProviderId}
              onValueChange={setCurrentProviderId}
            >
              <SelectTrigger className="shrink-0 w-24">
                <SelectValue placeholder="数据来源" />
              </SelectTrigger>
              <SelectContent>
                {dataProviders.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentProvider && <currentProvider.component />}
          </EcCard>

          {/* 选择操作 */}
          {!isLockMode && (
            <EcCard title="数据选择">
              {/* 选择模式 */}
              <Select
                value={currentSelectorId}
                onValueChange={setCurrentSelectorId}
              >
                <SelectTrigger className="shrink-0 w-24">
                  <SelectValue placeholder="选择模式" />
                </SelectTrigger>
                <SelectContent>
                  {dataSelectors.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentSelector && <currentSelector.component />}
            </EcCard>
          )}

          {/* 数据操作 */}
          <EcCard title="数据操作">
            <DataOperations />
          </EcCard>
        </div>
        {/* 数据列表 */}
        <DataList onSelect={currentSelector?.onItemClick || (() => {})} />
      </div>
    </div>
  );
}
