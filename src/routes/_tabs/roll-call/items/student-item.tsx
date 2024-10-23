import type { Student } from "@/services/types";

interface StudentItemProps {
  data: Student;
}

export default function StudentItem({ data }: StudentItemProps) {
  return (
    <div className="bg-card border border-border rounded-lg px-4 py-2">
      {data.name}
    </div>
  );
}
