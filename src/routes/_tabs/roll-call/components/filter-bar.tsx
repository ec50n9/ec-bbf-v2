import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/** 过滤栏 */
export default function FilterBar() {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-3 rounded-2xl",
        "bg-card border border-border",
      )}
    >
      <Select defaultValue="all">
        <SelectTrigger className="w-28">
          <SelectValue placeholder="选择数据类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="student">仅学生</SelectItem>
          <SelectItem value="student-group">仅分组</SelectItem>
        </SelectContent>
      </Select>

      <Input className="w-40" placeholder="输入关键词搜索" />

      <Button size="sm" variant="default">
        筛选
      </Button>
    </div>
  );
}
