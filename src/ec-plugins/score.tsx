import { Student } from "@/services/types";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { EcPlugin, ActionConfig } from "@/types/plugin";

const actions: ActionConfig<Student>[] = [
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

const InfoView = ({ data }: { data: Student }) => {
  return <div>这是{data.name}的信息</div>;
};

const plugin: EcPlugin<Student> = {
  actions,
  infoViews: [{ supportedTypes: Student, component: InfoView }],
};

export default plugin;
