import type { StudentGroup } from "../share";

interface StudentGroupItemProps {
  data: StudentGroup;
}

export default function StudentGroupItem({ data }: StudentGroupItemProps) {
  return (
    <div className="bg-card border border-border text-primary rounded-lg px-4 py-2">
      {data.name}
    </div>
  );
}
