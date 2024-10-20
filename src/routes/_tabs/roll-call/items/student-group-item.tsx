import type { StudentGroup } from "../share";

interface StudentGroupItemProps {
  data: StudentGroup;
}

export default function StudentGroupItem({ data }: StudentGroupItemProps) {
  return <div>{data.name}</div>;
}
