import { LuPlus, LuMinus, LuTrash } from "react-icons/lu";
import type { OperationConfig } from "@/components/share/ec-data-list";
import { type MixedData, Student, StudentGroup } from "./types";

export const operationConfigs: OperationConfig<MixedData>[] = [
  {
    key: "delete",
    label: "删除(s|g|e)",
    icon: LuTrash,
    supportedTypes: [Student, StudentGroup],
    action: (data) => {
      console.log(`Deleting ${data.name}`);
    },
  },
  {
    key: "addScore",
    label: "加分(s|g)",
    icon: LuPlus,
    supportedTypes: [Student],
    action: (data) => {
      console.log(`Adding score to ${data.name}`);
    },
  },
  {
    key: "subtractScore",
    label: "扣分(s|g)",
    icon: LuMinus,
    supportedTypes: [Student],
    action: (data) => {
      console.log(`Subtracting score from ${data.name}`);
    },
  },
];
