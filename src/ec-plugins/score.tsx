import { Student } from "@/services/types";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { EcPlugin, ActionConfig } from "@/types/plugin";
import { create } from "zustand";
import { promptForm } from "@/components/share/global-form-dialog";
import { z } from "zod";
import { getAllScoreTopics } from "@/services/score-topic";
import { getAllScoreEvents } from "@/services/score-event";
import { getDatabase } from "@/services/database";

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
      const { topic, event, updateTopic, updateEvent } = useScoreStore.getState();

      // 获取所有积分主题和事件
      const topics = await getAllScoreTopics();
      const events = await getAllScoreEvents();

      // 获取参数
      const args = await promptForm<{ topic: string; event: string }>([
        {
          key: "topic",
          label: "记分主题",
          type: "select",
          options: topics.map(t => ({ label: t.name, value: t.id.toString() })),
          defaultValue: topic || undefined,
          placeholder: "请选择记分主题",
          zod: z.string().min(1, { message: "请选择记分主题" }),
        },
        {
          key: "event",
          label: "事件",
          type: "select",
          options: events
            .filter(e => topic ? e.topic_id === parseInt(topic) : true)
            .map(e => ({ label: e.name, value: e.id.toString() })),
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
    action: async (student, args) => {
      const db = await getDatabase();
      await db.execute(
        "INSERT INTO score_record (student_id, event_id, score, type) VALUES (?, ?, 1, 'add')",
        [student.id, parseInt(args!.event)]
      );
    },
  },
  {
    key: "subtractScore",
    label: "扣分",
    icon: LuMinus,
    supportedTypes: [Student],
    argsResolver: async () => {
      const { topic, event, updateTopic, updateEvent } = useScoreStore.getState();

      // 获取所有积分主题和事件
      const topics = await getAllScoreTopics();
      const events = await getAllScoreEvents();

      // 获取参数
      const args = await promptForm<{ topic: string; event: string }>([
        {
          key: "topic",
          label: "记分主题",
          type: "select",
          options: topics.map(t => ({ label: t.name, value: t.id.toString() })),
          defaultValue: topic || undefined,
          placeholder: "请选择记分主题",
          zod: z.string().min(1, { message: "请选择记分主题" }),
        },
        {
          key: "event",
          label: "事件",
          type: "select",
          options: events
            .filter(e => topic ? e.topic_id === parseInt(topic) : true)
            .map(e => ({ label: e.name, value: e.id.toString() })),
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
    action: async (student, args) => {
      const db = await getDatabase();
      await db.execute(
        "INSERT INTO score_record (student_id, event_id, score, type) VALUES (?, ?, 1, 'subtract')",
        [student.id, parseInt(args!.event)]
      );
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
