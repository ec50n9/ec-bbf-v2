import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudent } from "@/services/student";
import { Student } from "@/services/types";
import { usePluginStore } from "@/stores/plugin-store";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function Details() {
  const { type, id } = useParams();
  const [student, setStudent] = useState<Student>();

  const allInfoViews = usePluginStore((s) => s.infoViews);
  console.log("all info views:", allInfoViews);
  const infoViews = useMemo(
    () => allInfoViews.filter((i) => i.supportedTypes === Student),
    [allInfoViews],
  );

  useEffect(() => {
    (async () => {
      if (type === "student") {
        const [_student] = await getStudent(Number(id));
        if (!_student) throw new Error("学生不存在");
        setStudent(_student);

        console.log("学生:", student);
      }
    })();

    console.log("所有信息视图:", allInfoViews);
  }, []);

  return (
    student && (
      <div className="h-screen overflow-auto">
        <div className="mt-5 flex flex-col items-center gap-1">
          <Avatar className="size-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{student.name.slice(-2)}</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-medium">{student.name}</h1>
        </div>

        {infoViews.map((view) => (
          <view.component key={view.component.name} data={student} />
        ))}
      </div>
    )
  );
}
