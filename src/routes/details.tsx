import { getStudent } from "@/services/student";
import { Student } from "@/services/types";
import { usePluginStore } from "@/stores/plugin-store";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function Details() {
  const { type, id } = useParams();
  const [student, setStudent] = useState<Student>();

  const allInfoViews = usePluginStore((s) => s.infoViews);
  console.log('all info views:', allInfoViews)
  const infoViews = useMemo(
    () => allInfoViews.filter((i) => i.supportedTypes === Student),
    [allInfoViews],
  );

  useEffect(() => {
    (async () => {
      if (type === "student") {
        const [_student] = await getStudent(Number(id));
        console.log("学生:", student);
        if (!_student) throw new Error("学生不存在");
        setStudent(_student);
      }
    })();

    console.log("所有信息视图:", allInfoViews);
  }, []);

  return (
    student && (
      <div className="h-screen overflow-auto">
        <h1 className="mt-5 mx-4 text-2xl font-medium">{student.name}</h1>
        {infoViews.map((view) => view.component({ data: student }))}
      </div>
    )
  );
}
