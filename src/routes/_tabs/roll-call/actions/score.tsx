import { Student } from "@/services/types";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { EcPlugin } from "@/types/plugin";

const plugin: EcPlugin<Student> = {
  actions: [
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
  ],
};

export default plugin;
