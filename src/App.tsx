import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LuSquirrel,
  LuSettings,
  LuLassoSelect,
  LuClipboardList,
  LuAlarmClock,
  LuAward,
  LuHome,
} from "react-icons/lu";
import { cn } from "./lib/utils";

export default function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="h-screen grid grid-cols-[auto_1fr] gap-8 bg-[#faf7f5] text-slate-700 p-4">
      <SideBar className="rounded-xl" />

      <div className="of-auto">
        <h1 className="mt-5 text-4xl font-medium">下午好，今天好好学习了没!</h1>

        {/* <form
          className=""
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <Button type="submit">Greet</Button>
        </form>

        <p>{greetMsg}</p> */}
      </div>
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
          <LuHome className="size-4 " />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <LuLassoSelect className="size-4 " />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <LuClipboardList className="size-4 " />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <LuAlarmClock className="size-4 " />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <LuAward className="size-4 " />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <LuSettings className="size-4 " />
        </Button>
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
