import { RainbowButton } from "../ui/rainbow-button";
import PulsatingButton from "@/components/ui/pulsating-button";
import ActionButton from "./action-button";
import RetroGrid from "@/components/ui/retro-grid";
import type { StepFormProps } from "./share";

export default function EverythingReady(props: StepFormProps) {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        EduCatalyst(启元)
      </span>
      <PulsatingButton className="mt-5 bg-blue-500 z-10">开启新的教学方式！</PulsatingButton>
      <RetroGrid />
    </div>
  );
}
