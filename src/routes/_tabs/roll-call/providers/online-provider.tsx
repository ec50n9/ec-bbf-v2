import { Button } from "@/components/ui/button";
import { create } from "zustand";

type OnlineProviderState = {};

export const useOnlineProviderStore = create<OnlineProviderState>(
  (set, get) => ({}),
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
