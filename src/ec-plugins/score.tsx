import { Student } from "@/services/types";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { EcPlugin, ActionConfig } from "@/types/plugin";
import { create } from "zustand";
import { promptForm } from "@/components/share/global-form-dialog";
import { z } from "zod";
import { getAllScoreTopics, ScoreTopic } from "@/services/score-topic";
import { getAllScoreEvents, ScoreEvent, getStudentEventScore, getScoreEvent } from "@/services/score-event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDatabase } from "@/services/database";
import { useEffect, useState } from "react";

type ScoreStore = {
  topic: string | null;
  event: string | null;
  score: number | null;
  updateTopic: (topic: ScoreStore["topic"]) => void;
  updateEvent: (event: ScoreStore["event"]) => void;
  updateScore: (score: ScoreStore["score"]) => void;
};

const useScoreStore = create<ScoreStore>((set) => ({
  topic: null,
  event: null,
  score: null,
  updateTopic: (topic) => set({ topic }),
  updateEvent: (event) => set({ event }),
  updateScore: (score) => set({ score }),
}));

const actions: ActionConfig<Student>[] = [
  {
    key: "addScore",
    label: "加分",
    icon: LuPlus,
    supportedTypes: [Student],
    argsResolver: async () => {
      const { topic, event, score, updateTopic, updateEvent, updateScore } = useScoreStore.getState();

      // 获取所有积分主题和事件
      const topics = await getAllScoreTopics();
      const events = await getAllScoreEvents();

      // 获取参数
      const args = await promptForm<{ topic: string; event: string; score: number }>([
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
        {
          key: "score",
          label: "分数",
          type: "number",
          defaultValue: score || 1,
          placeholder: "请输入分数",
          zod: z.number().min(0.1, { message: "分数必须大于0" }),
        }
      ]);

      // 缓存所有参数
      updateTopic(args.topic);
      updateEvent(args.event);
      updateScore(args.score);

      return args;
    },
    action: async (student, args) => {
      const db = await getDatabase();
      const event = await getScoreEvent(parseInt(args!.event));
      await db.execute(
        "INSERT INTO student_score_mapping (student_id, topic_id, event_id, score, type) VALUES (?, ?, ?, ?, 'add')",
        [student.id, event[0].topic_id, parseInt(args!.event), args!.score]
      );
    },
  },
  {
    key: "subtractScore",
    label: "扣分",
    icon: LuMinus,
    supportedTypes: [Student],
    argsResolver: async () => {
      const { topic, event, score, updateTopic, updateEvent, updateScore } = useScoreStore.getState();

      // 获取所有积分主题和事件
      const topics = await getAllScoreTopics();
      const events = await getAllScoreEvents();

      // 获取参数
      const args = await promptForm<{ topic: string; event: string; score: number }>([
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
        {
          key: "score",
          label: "分数",
          type: "number",
          defaultValue: score || 1,
          placeholder: "请输入分数",
          zod: z.number().min(0.1, { message: "分数必须大于0" }),
        }
      ]);

      // 缓存所有参数
      updateTopic(args.topic);
      updateEvent(args.event);
      updateScore(args.score);

      return args;
    },
    action: async (student, args) => {
      const db = await getDatabase();
      const event = await getScoreEvent(parseInt(args!.event));
      await db.execute(
        "INSERT INTO student_score_mapping (student_id, topic_id, event_id, score, type) VALUES (?, ?, ?, ?, 'subtract')",
        [student.id, event[0].topic_id, parseInt(args!.event), args!.score]
      );
    },
  },
];

const ScoreView = ({ data: student }: { data: Student }) => {
  const [topics, setTopics] = useState<ScoreTopic[]>([]);
  const [events, setEvents] = useState<ScoreEvent[]>([]);
  const [scores, setScores] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadData = async () => {
      // 加载主题和事件数据
      const [topicsData, eventsData] = await Promise.all([
        getAllScoreTopics(),
        getAllScoreEvents(),
      ]);
      setTopics(topicsData);
      setEvents(eventsData);

      // 加载所有事件的分数
      const scorePromises = eventsData.map(event => 
        getStudentEventScore(student.id, event.id)
      );
      const scoreResults = await Promise.all(scorePromises);
      
      // 构建事件ID到分数的映射
      const scoreMap = eventsData.reduce((acc, event, index) => {
        acc[event.id] = scoreResults[index];
        return acc;
      }, {} as Record<number, number>);
      
      setScores(scoreMap);
    };
    loadData();
  }, [student.id]);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>成绩记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topics.map((topic) => (
              <div key={topic.id} className="space-y-2">
                <h3 className="text-lg font-medium text-primary">{topic.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events
                    .filter((event) => event.topic_id === topic.id)
                    .map((event) => (
                      <Card key={event.id} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {event.name}
                            </span>
                            <span className="text-2xl font-bold text-primary">
                              {scores[event.id] || 0}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const plugin: EcPlugin<Student> = {
  actions,
  infoViews: [{ supportedTypes: Student, component: ScoreView }],
};

export default plugin;
