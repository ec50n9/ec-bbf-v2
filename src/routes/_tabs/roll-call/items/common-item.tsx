import { Student, StudentGroup, type MixedData } from "../share";
import type { DataItemProps } from "@/components/share/ec-data-list";
import StudentItem from "./student-item";
import StudentGroupItem from "./student-group-item";

export default function CommonItem({
  data,
  isDisabled,
}: DataItemProps<MixedData>) {
  if (data instanceof Student) {
    return <StudentItem data={data} />;
  }
  if (data instanceof StudentGroup) {
    return <StudentGroupItem data={data} />;
  }
}
