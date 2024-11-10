import Header from "@/components/share/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreEvent } from "@/services/score-event";
import { ScoreTopic } from "@/services/score-topic";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";

// Mock data
const initialTopics: ScoreTopic[] = [
  { id: 1, name: "Math", class_id: 1, subject_id: 1 },
  { id: 2, name: "English", class_id: 1, subject_id: 1 },
];

const initialEvents: ScoreEvent[] = [
  { id: 1, name: "第一次月考", topic_id: 1 },
  { id: 2, name: "第二次月考", topic_id: 1 },
  { id: 3, name: "期中考试", topic_id: 2 },
];

export default function ScoreManagement() {
  return (
    <div>
      <Header title="积分管理" />
      <ContentTables />
    </div>
  );
}

const ContentTables = () => {
  const [topics, setTopics] = useState<ScoreTopic[]>(initialTopics);
  const [events, setEvents] = useState<ScoreEvent[]>(initialEvents);
  const [selectedTopic, setSelectedTopic] = useState<ScoreTopic | null>(null);
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ScoreTopic | null>(null);
  const [editingEvent, setEditingEvent] = useState<ScoreEvent | null>(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [newEventName, setNewEventName] = useState("");

  // Topic CRUD operations
  const handleAddTopic = () => {
    if (!newTopicName) return;
    const newTopic: ScoreTopic = {
      id: topics.length + 1,
      name: newTopicName,
      class_id: 1,
      subject_id: 1,
    };
    setTopics([...topics, newTopic]);
    setNewTopicName("");
    setIsTopicDialogOpen(false);
  };

  const handleEditTopic = () => {
    if (!editingTopic || !newTopicName) return;
    setTopics(
      topics.map((topic) =>
        topic.id === editingTopic.id ? { ...topic, name: newTopicName } : topic,
      ),
    );
    setEditingTopic(null);
    setNewTopicName("");
    setIsTopicDialogOpen(false);
  };

  const handleDeleteTopic = (id: number) => {
    setTopics(topics.filter((topic) => topic.id !== id));
    setEvents(events.filter((event) => event.topic_id !== id));
    if (selectedTopic?.id === id) {
      setSelectedTopic(null);
    }
  };

  // Event CRUD operations
  const handleAddEvent = () => {
    if (!selectedTopic) return;
    const newEvent = {
      id: events.length + 1,
      name: newEventName,
      topic_id: selectedTopic.id,
    };
    setEvents([...events, newEvent]);
    setNewEventName("");
    setIsEventDialogOpen(false);
  };

  const handleEditEvent = () => {
    if (!editingEvent || !newEventName) return;
    setEvents(
      events.map((event) =>
        event.id === editingEvent.id ? { ...event, name: newEventName } : event,
      ),
    );
    setEditingEvent(null);
    setNewEventName("");
    setIsEventDialogOpen(false);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <div className="mt-3 mr-4 flex items-stretch gap-4">
      {/* Topics Card */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>主题</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingTopic(null);
                setNewTopicName("");
                setIsTopicDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              添加主题
            </Button>
            {/* 主题编辑弹窗 */}
            <Dialog
              open={isTopicDialogOpen}
              onOpenChange={setIsTopicDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTopic ? "编辑主题" : "添加新主题"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="Topic name"
                  />
                  <Button
                    onClick={editingTopic ? handleEditTopic : handleAddTopic}
                  >
                    {editingTopic ? "保存主题" : "添加主题"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow
                  key={topic.id}
                  className={`cursor-pointer ${selectedTopic?.id === topic.id ? "bg-muted" : ""}`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <TableCell>{topic.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTopic(topic);
                          setNewTopicName(topic.name);
                          setIsTopicDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTopic(topic.id);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Events Card */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>事件</CardTitle>
            <Button
              variant="outline"
              size="sm"
              disabled={!selectedTopic}
              onClick={() => {
                setEditingEvent(null);
                setNewEventName("");
                setIsEventDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              添加事件
            </Button>
            {/* 事件编辑弹窗 */}
            <Dialog
              open={isEventDialogOpen}
              onOpenChange={setIsEventDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? "编辑事件" : "添加新事件"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="Event name"
                  />
                  <Button
                    onClick={editingEvent ? handleEditEvent : handleAddEvent}
                  >
                    {editingEvent ? "保存事件" : "添加事件"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events
                .filter(
                  (event) =>
                    !selectedTopic || event.topic_id === selectedTopic.id,
                )
                .map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEvent(event);
                          setNewEventName(event.name);
                          setIsEventDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
