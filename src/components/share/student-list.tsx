import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ErrorPage from "@/components/share/error-page";
import { insertClass, getAllClasses } from "@/services/class";
import { useDatabase } from "@/hooks/useDatabaseHook";

export default function StudentList() {
  const { db } = useDatabase();

  useEffect(() => {
    if (!db) return;
    getAllClasses(db).then((res) => {
      console.log("全部班级:", res);
    });
  });

  if (!db) return <ErrorPage desc="数据库连接失败，请检查数据库配置" />;

  const handleCreateRecord = async () => {
    const res = await insertClass(db, {
      name: "数据库测试",
      grade: "一",
      class: "大一",
    });
    console.log("创建班级:", res);
  };

  const displayModes = [
    {
      value: "student",
      label: "学生",
    },
    {
      value: "student-group",
      label: "分组",
    },
  ];
  const [displayMode, setDisplayMode] = useState(displayModes[0].value);

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between pl-1 pr-5">
        <Select defaultValue={displayMode} onValueChange={setDisplayMode}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="展示模式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">学生列表</SelectItem>
            <SelectItem value="student-group">学生分组</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleCreateRecord}>添加学生</Button>
      </div>
    </div>
  );
}
