import type { Student } from "../share";

interface StudentItemProps {
  data: Student;
}

export default function StudentItem({ data }: StudentItemProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm shadow-indigo-100">
      {data.name}
    </div>
  );
}
