import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
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
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons/lib";
import { ThemeModeToggle } from "@/components/share/theme-mode-toggle";

export default function Root() {
  const navigate = useNavigate();

  const gotoLogin = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    // TODO: 检查登录状态
    // gotoLogin();
  }, [gotoLogin]);

  return (
    <div className="h-screen grid grid-cols-[auto_1fr] gap-8 bg-background text-foreground overflow-hidden">
      <SideBar className="rounded-2xl" />
      <div className="overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

/** 侧边栏 */
function SideBar(props: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = {
    top: [{ name: "首页", icon: LuHome, path: "/" }],
    center: [
      { name: "点名", icon: LuLassoSelect, path: "/roll-call" },
      { name: "积分", icon: LuClipboardList, path: "/score" },
      { name: "计时器", icon: LuTimer, path: "/timer" },
      { name: "倒计时", icon: LuAlarmClock, path: "/countdown" },
      { name: "排行榜", icon: LuAward, path: "/ranking-list" },
    ],
    bottom: [
      { name: "主题", component: ThemeModeToggle },
      { name: "设置", icon: LuSettings, path: "/settings" },
    ],
  };

  const handleOnNavigation = (path: string) => {
    navigate(path, { replace: true });
  };

  return (
    <div
      className={cn(
        "ml-4 my-4 flex flex-col justify-between items-center gap-8 p-4",
        "bg-card text-foreground border border-solid border-border",
        props.className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <LuSquirrel className="text-3xl text-amber-700 drop-shadow-lg" />
        {routes.top.map((item) => (
          <NavItem
            key={item.name}
            {...item}
            selected={location.pathname === item.path}
            onNavigate={handleOnNavigation}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {routes.center.map((item) => (
          <NavItem
            key={item.name}
            {...item}
            selected={location.pathname === item.path}
            onNavigate={handleOnNavigation}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {routes.bottom.map((item) =>
          item.component ? (
            <item.component key={item.name} />
          ) : (
            <NavItem
              key={item.name}
              {...item}
              selected={location.pathname === item.path}
              onNavigate={handleOnNavigation}
            />
          ),
        )}
      </div>
    </div>
  );
}

/** 导航项 */
function NavItem(props: {
  name: string;
  icon: IconType;
  path: string;
  currentPath?: string;
  selected: boolean;
  onNavigate?: (path: string) => void;
}) {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          variant={props.selected ? "default" : "outline"}
          size="icon"
          className="rounded-full"
          onClick={() => props.onNavigate?.(props.path)}
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
