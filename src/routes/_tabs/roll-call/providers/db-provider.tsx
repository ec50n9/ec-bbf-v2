import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { create } from "zustand";

type DbProviderState = {};

export const useDbProviderStore = create<DbProviderState>((set, get) => ({}));

export const DbProvider = () => {
  return (
    <>
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
    </>
  );
};
