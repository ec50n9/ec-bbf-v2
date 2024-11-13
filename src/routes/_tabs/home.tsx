import { LuBellRing, LuSettings, LuTimer, LuList, LuClipboardList, LuTrophy } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function Home() {
  const shortcuts = [
    { 
      icon: LuTimer, 
      label: "计时器", 
      path: "/timer", 
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-600",
      iconColor: "text-blue-600"
    },
    { 
      icon: LuClipboardList, 
      label: "点名", 
      path: "/roll-call", 
      color: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-600",
      iconColor: "text-green-600"
    },
    { 
      icon: LuList, 
      label: "积分管理", 
      path: "/score-management", 
      color: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-600",
      iconColor: "text-purple-600"
    },
  ];

  return (
    <div className="h-full grid grid-cols-[1fr_auto] gap-8">
      <div className="pt-4">
        <h1 className="mt-5 text-4xl font-medium leading-snug">
          下午好，
          <br />
          今天好好学习了没？
        </h1>

        <div className="mt-10">
          <h2 className="text-lg font-medium text-muted-foreground mb-4">快速开始</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.path}
                to={shortcut.path}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  shortcut.color
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <shortcut.icon className={cn("w-8 h-8", shortcut.iconColor)} />
                  <span className={cn("text-sm", shortcut.textColor)}>{shortcut.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
