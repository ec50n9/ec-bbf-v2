import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudent } from "@/services/student";
import { Student } from "@/services/types";
import { usePluginStore } from "@/stores/plugin-store";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreTopic } from "@/services/score-topic";
import { ScoreEvent } from "@/services/score-event";
import { getAllScoreTopics } from "@/services/score-topic";
import { getAllScoreEvents } from "@/services/score-event";

export default function Details() {
  const { type, id } = useParams();
  const [student, setStudent] = useState<Student>();

  const allInfoViews = usePluginStore((s) => s.infoViews);
  console.log("all info views:", allInfoViews);
  const infoViews = useMemo(
    () => allInfoViews.filter((i) => i.supportedTypes === Student),
    [allInfoViews],
  );

  useEffect(() => {
    (async () => {
      if (type === "student") {
        const [_student] = await getStudent(Number(id));
        if (!_student) throw new Error("学生不存在");
        setStudent(_student);

        console.log("学生:", student);
      }
    })();

    console.log("所有信息视图:", allInfoViews);
  }, []);

  return (
    student && (
      <div className="h-screen overflow-auto">
        <div className="mt-5 flex flex-col items-center gap-1">
          <Avatar className="size-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{student.name.slice(-2)}</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-medium">{student.name}</h1>
        </div>

        {infoViews.map((view) => (
          <view.component key={view.component.name} data={student} />
        ))}
      </div>
    )
  );
}

function ScoreView({ data: student }: { data: Student }) {
  const [topics, setTopics] = useState<ScoreTopic[]>([]);
  const [events, setEvents] = useState<ScoreEvent[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [topicsData, eventsData] = await Promise.all([
        getAllScoreTopics(),
        getAllScoreEvents(),
      ]);
      setTopics(topicsData);
      setEvents(eventsData);
    };
    loadData();
  }, []);

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
                              95
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
}