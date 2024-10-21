import type { Student } from "../share";

interface StudentItemProps {
  data: Student;
}

export default function StudentItem({ data }: StudentItemProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {data.name}
    </div>
  );
}
