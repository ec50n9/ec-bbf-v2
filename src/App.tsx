import "./App.css";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LuSquirrel,
  LuSettings,
  LuLassoSelect,
  LuClipboardList,
  LuAlarmClock,
  LuAward,
  LuHome,
  LuBellRing,
} from "react-icons/lu";
import { cn } from "./lib/utils";

export default function App() {
  return (
    <div className="h-screen grid grid-cols-[auto_1fr_auto] gap-8 bg-[#faf7f5] text-slate-700 p-4">
      <SideBar className="rounded-xl" />

      <div className="of-auto">
        <h1 className="mt-5 text-4xl font-medium leading-snug">
          下午好，
          <br />
          今天好好学习了没？
        </h1>
      </div>

      <UserInfoPanel className="w-72 rounded-3xl" />
    </div>
  );
}

function SideBar(props: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between items-center gap-8 bg-[#f1e8e1] p-4",
        props.className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <LuSquirrel className="text-3xl" />
        <Button variant="default" size="icon" className="rounded-full">
          <LuHome className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <LuLassoSelect className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <LuClipboardList className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <LuAlarmClock className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <LuAward className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <LuSettings className="size-4" />
        </Button>
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function UserInfoPanel(props: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col bg-[#f1e8e1] p-4 overflow-auto",
        props.className,
      )}
    >
      <div className="flex justify-between">
        <LuBellRing className="size-5" />
        <div className="flex flex-col items-center pt-3">
          <Avatar className="size-14">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="mt-2 text-xl font-medium">梁高菘</p>
        </div>
        <LuSettings className="size-5" />
      </div>

      <div className="mt-4 bg-white px-3 py-3 rounded-full">
        <LuSettings />
      </div>
    </div>
  );
}
