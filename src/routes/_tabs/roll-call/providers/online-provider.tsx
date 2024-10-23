import { Button } from "@/components/ui/button";
import { create } from "zustand";

type OnlineProviderState = {
  initData: () => void;
};

export const useOnlineProviderStore = create<OnlineProviderState>(
  (set, get) => ({
    initData: () => {},
  }),
);

export const OnlineProvider = () => {
  return (
    <>
      <Button size="sm" variant="default">
        获取
      </Button>
    </>
  );
};
