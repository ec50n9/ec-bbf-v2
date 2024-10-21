import type { StudentGroup } from "../share";

interface StudentGroupItemProps {
  data: StudentGroup;
}

export default function StudentGroupItem({ data }: StudentGroupItemProps) {
  return (
    <div className="bg-card border border-border text-primary rounded-lg p-4">
      {data.name}
    </div>
  );
}
