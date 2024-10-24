import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/theme-provider";

export function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" variant="outline" size="icon">
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="center" sideOffset={10}>
        <DropdownMenuCheckboxItem
          checked={theme === "light"}
          onClick={() => setTheme("light")}
        >
          亮色
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          深色
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "system"}
          onClick={() => setTheme("system")}
        >
          跟随系统
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
