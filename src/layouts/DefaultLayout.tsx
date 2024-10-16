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
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function DefaultLayout(props: { children: React.ReactNode }) {
  return (
    <div className="h-screen grid grid-cols-[auto_1fr_auto] gap-8 bg-[#faf7f5] text-slate-700 overflow-hidden">
      <SideBar className="rounded-2xl" />
      <div className="overflow-auto">{props.children}</div>
      <UserInfoPanel className="w-72 rounded-3xl" />
    </div>
  );
}

function SideBar(props: { className?: string }) {
  const routes = {
    top: [{ name: "首页", icon: LuHome, path: "/" }],
    center: [
      { name: "点名", icon: LuLassoSelect, path: "/test" },
      { name: "积分", icon: LuClipboardList, path: "/test" },
      { name: "计时器", icon: LuAlarmClock, path: "/test" },
      { name: "排行榜", icon: LuAward, path: "/test" },
    ],
    bottom: [{ name: "设置", icon: LuSettings, path: "/test" }],
  };

  const location = useLocation();

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
          <Link key={item.name} to={item.path} title={item.name}>
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
          <Link key={item.name} to={item.path} title={item.name}>
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
          <Link key={item.name} to={item.path} title={item.name}>
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
