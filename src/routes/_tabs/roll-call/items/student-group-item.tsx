import type { StudentGroup } from "../share";

interface StudentGroupItemProps {
  data: StudentGroup;
}

export default function StudentGroupItem({ data }: StudentGroupItemProps) {
  return (
    <div className="bg-orange-400 text-white rounded-lg p-4 shadow-sm shadow-orange-100">
      {data.name}
    </div>
  );
}
