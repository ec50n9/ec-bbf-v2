import { Student } from "@/services/types";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { EcPlugin } from "@/types/plugin";
import type { OperationConfig } from "@/components/share/ec-data-list";

const actions: OperationConfig<Student>[] = [
  {
    key: "addScore",
    label: "加分",
    icon: LuPlus,
    supportedTypes: [Student],
    action: (data) => {
      console.log(`Adding score to ${data.name}`);
    },
  },
  {
    key: "subtractScore",
    label: "扣分",
    icon: LuMinus,
    supportedTypes: [Student],
    action: (data) => {
      console.log(`Subtracting score from ${data.name}`);
    },
  },
];

const InfoView = () => {
  return <div>DataView</div>;
};

const plugin: EcPlugin<Student> = {
  actions,
  dataView: { component: InfoView },
};

export default plugin;
