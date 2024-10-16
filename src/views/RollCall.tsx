import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { insertClass, getAllClasses } from "@/services/class";
import { useDatabase } from "@/hooks/useDatabaseHook";

export default function RollCall() {
  const { db } = useDatabase();

  useEffect(() => {
    if (!db) return;
    getAllClasses(db).then((res) => {
      console.log("全部班级:", res);
    });
  });

  if (!db) return <div>数据库连接失败</div>;

  const handleCreateRecord = async () => {
    const res = await insertClass(db, {
      name: "数据库测试",
      grade: "一",
      class: "大一",
    });
    console.log("创建班级:", res);
  };

  return (
    <div className="h-full">
      <h1 className="pt-9 text-4xl font-medium leading-snug">点名</h1>
      <div>
        <p>数据库连接成功</p>
        <Button onClick={handleCreateRecord}>创建记录</Button>
      </div>
    </div>
  );
}
