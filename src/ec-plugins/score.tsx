import { Student } from "@/services/types";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { EcPlugin, ActionConfig } from "@/types/plugin";
import { create } from "zustand";
import { promptForm } from "@/components/share/global-form-dialog";
import { z } from "zod";

type ScoreStore = {
  topic: string | null;
  event: string | null;
  updateTopic: (topic: ScoreStore["topic"]) => void;
  updateEvent: (event: ScoreStore["event"]) => void;
};

const useScoreStore = create<ScoreStore>((set, get) => ({
  topic: null,
  event: null,
  updateTopic: (topic) => set({ topic }),
  updateEvent: (event) => set({ event }),
}));

const actions: ActionConfig<Student>[] = [
  {
    key: "addScore",
    label: "加分",
    icon: LuPlus,
    supportedTypes: [Student],
    argsResolver: async () => {
      // 判断参数是否存在
      const { topic, event, updateTopic, updateEvent } =
        useScoreStore.getState();

      // 获取参数
      const args = await promptForm<{ topic: string; event: string }>([
        {
          key: "topic",
          label: "记分主题",
          type: "select",
          options: [{ label: "1", value: "1" }],
          defaultValue: topic || undefined,
          placeholder: "请选择记分主题",
          zod: z.string().min(1, { message: "请选择记分主题" }),
        },
        {
          key: "event",
          label: "事件",
          type: "select",
          options: [{ label: "1", value: "1" }],
          defaultValue: event || undefined,
          placeholder: "请选择记分事件",
          zod: z.string().min(1, { message: "请选择记分事件" }),
        },
      ]);

      // 缓存参数
      updateTopic(args.topic);
      updateEvent(args.event);

      return args;
    },
    action: (data, args) => {
      console.log(`Adding score to ${data.name}`, args);
    },
  },
  {
    key: "subtractScore",
    label: "扣分",
    icon: LuMinus,
    supportedTypes: [Student],
    argsResolver: async () => {
      // 判断参数是否存在
      const { topic, event, updateTopic, updateEvent } =
        useScoreStore.getState();

      // 获取参数
      const args = await promptForm<{ topic: string; event: string }>([
        {
          key: "topic",
          label: "记分主题",
          type: "select",
          options: [{ label: "1", value: "1" }],
          defaultValue: topic || undefined,
          placeholder: "请选择记分主题",
          zod: z.string().min(1, { message: "请选择记分主题" }),
        },
        {
          key: "event",
          label: "事件",
          type: "select",
          options: [{ label: "1", value: "1" }],
          defaultValue: event || undefined,
          placeholder: "请选择记分事件",
          zod: z.string().min(1, { message: "请选择记分事件" }),
        },
      ]);

      // 缓存参数
      updateTopic(args.topic);
      updateEvent(args.event);

      return args;
    },
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
