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
} from "react-icons/lu";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
      { name: "计时器", icon: LuAlarmClock, path: "/timer" },
      { name: "倒计时", icon: LuAlarmClock, path: "/countdown" },
      { name: "排行榜", icon: LuAward, path: "/ranking-list" },
    ],
    bottom: [{ name: "设置", icon: LuSettings, path: "/settings" }],
  };

  const location = useLocation();
  const navigate = useNavigate();

  const handleReplaceNavigation = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string,
  ) => {
    event.preventDefault();
    navigate(path, { replace: true });
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
          <Link
            key={item.name}
            to={item.path}
            title={item.name}
            onClick={(e) => handleReplaceNavigation(e, item.path)}
          >
            <Button
              variant={location.pathname === item.path ? "default" : "outline"}
              size="icon"
              className="rounded-full"
            >
              <item.icon className="size-4" />
            </Button>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {routes.center.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            title={item.name}
            onClick={(e) => handleReplaceNavigation(e, item.path)}
          >
            <Button
              variant={location.pathname === item.path ? "default" : "outline"}
              size="icon"
              className="rounded-full"
            >
              <item.icon className="size-4" />
            </Button>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {routes.bottom.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            title={item.name}
            onClick={(e) => handleReplaceNavigation(e, item.path)}
          >
            <Button
              variant={location.pathname === item.path ? "default" : "outline"}
              size="icon"
              className="rounded-full"
            >
              <item.icon className="size-4" />
            </Button>
          </Link>
        ))}
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
