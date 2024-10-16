import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LuSquirrel,
  LuSettings,
  LuLassoSelect,
  LuClipboardList,
  LuAlarmClock,
  LuAward,
  LuHome,
  LuTimer,
} from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons/lib";

export default function DefaultLayout(props: { children: React.ReactNode }) {
  return (
    <div className="h-screen grid grid-cols-[auto_1fr] gap-8 bg-[#faf7f5] text-slate-700 overflow-hidden">
      <SideBar className="rounded-2xl" />
      <div className="overflow-auto">{props.children}</div>
    </div>
  );
}

function SideBar(props: { className?: string }) {
  const routes = {
    top: [{ name: "首页", icon: LuHome, path: "/" }],
    center: [
      { name: "点名", icon: LuLassoSelect, path: "/roll-call" },
      { name: "积分", icon: LuClipboardList, path: "/score" },
      { name: "计时器", icon: LuTimer, path: "/timer" },
      { name: "倒计时", icon: LuAlarmClock, path: "/countdown" },
      { name: "排行榜", icon: LuAward, path: "/ranking-list" },
    ],
    bottom: [{ name: "设置", icon: LuSettings, path: "/settings" }],
  };

  return (
    <div
      className={cn(
        "ml-4 my-4 flex flex-col justify-between items-center gap-8 bg-[#f1e8e1] p-4",
        props.className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <LuSquirrel className="text-3xl" />
        {routes.top.map((item) => (
          <NavItem key={item.name} {...item} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {routes.center.map((item) => (
          <NavItem key={item.name} {...item} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {routes.bottom.map((item) => (
          <NavItem key={item.name} {...item} />
        ))}
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function NavItem(props: { name: string; icon: IconType; path: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleReplaceNavigation = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    path: string,
  ) => {
    event.preventDefault();
    navigate(path, { replace: true });
  };

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          variant={location.pathname === props.path ? "default" : "outline"}
          size="icon"
          className="rounded-full"
          onClick={(e) => handleReplaceNavigation(e, props.path)}
        >
          <props.icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {props.name}
      </TooltipContent>
    </Tooltip>
  );
}
