import { LuBellRing, LuSettings } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="h-full grid grid-cols-[1fr_auto] gap-8">
      <div className="pt-4">
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

function UserInfoPanel(props: { className?: string }) {
  return (
    <div
      className={cn(
        "mr-4 my-4 flex flex-col bg-[#f1e8e1] p-4 overflow-auto",
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
