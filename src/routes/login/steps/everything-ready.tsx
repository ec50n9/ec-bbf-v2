import PulsatingButton from "@/components/ui/pulsating-button";
import RetroGrid from "@/components/ui/retro-grid";
import type { StepFormProps } from "../share";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useGlobalStore } from "@/stores/global-store";
import { useLoginStore } from "../store";
import { getClass } from "@/services/class";
import { getSubject } from "@/services/subject";

export default function EverythingReady(props: StepFormProps) {
  const handleOnClick = async () => {
    const clazzId = useLoginStore.getState().clazzId;
    const subjectId = useLoginStore.getState().subjectId;

    if (!clazzId || !subjectId)
      throw new Error("clazzId or subjectId is null!");

    const [clazz] = await getClass(clazzId);
    const [subject] = await getSubject(subjectId);

    const updateIsolationCondition =
      useGlobalStore.getState().updateIsolationCondition;
    updateIsolationCondition({ clazz, subject });

    const webview = getCurrentWebviewWindow();
    webview.close();
  };

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        千呼万唤始出来
      </span>
      <PulsatingButton
        className="mt-10 bg-blue-500 z-10"
        onClick={handleOnClick}
      >
        开启新的教学方式！
      </PulsatingButton>
      <RetroGrid />
    </div>
  );
}
