import Header from "@/components/share/header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuPlay, LuPause, LuRotateCcw, LuPlus, LuTrash2, LuClock, LuStopCircle, LuCheck } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface TimerTask {
  id: number;
  name: string;
  time: number;
  isRunning: boolean;
  showMilliseconds: boolean;
  isEditing?: boolean;
}

export default function Timer() {
  const [tasks, setTasks] = useState<TimerTask[]>([]);
  const [newTaskName, setNewTaskName] = useState("");

  const [listAnimateParent] = useAutoAnimate();
  const [taskNameParent] = useAutoAnimate();

  const getDefaultTaskName = () => {
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const existingDefaultTasks = tasks.filter(task =>
      task.name.match(/^计时任务（[一二三四五六七八九十]）$/)
    ).length;
    return `计时任务（${chineseNumbers[existingDefaultTasks]}）`;
  };

  const addTask = () => {
    const taskName = newTaskName.trim() || getDefaultTaskName();
    const newTask: TimerTask = {
      id: Date.now(),
      name: taskName,
      time: 0,
      isRunning: false,
      showMilliseconds: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskName("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleMilliseconds = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, showMilliseconds: !task.showMilliseconds } : task
    ));
  };

  const toggleTimer = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isRunning: !task.isRunning } : task
    ));
  };

  const resetTimer = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, time: 0, isRunning: false } : task
    ));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const formatTime = (seconds: number, showMilliseconds: boolean) => {
    if (showMilliseconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      const ms = Math.floor((seconds % 1) * 100);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  useEffect(() => {
    const intervals: number[] = [];
    tasks.forEach(task => {
      if (task.isRunning) {
        const interval = window.setInterval(() => {
          setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, time: t.time + (t.showMilliseconds ? 0.01 : 1) } : t
          ));
        }, task.showMilliseconds ? 10 : 1000);
        intervals.push(interval);
      }
    });
    return () => intervals.forEach(clearInterval);
  }, [tasks]);

  const startEditing = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  const updateTaskName = (id: number, newName: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, name: newName.trim() || getDefaultTaskName(), isEditing: false } : task
    ));
  };

  return (
    <div className="h-screen flex flex-col">
      <Header title="计时器" />
      <div className="flex gap-2 mt-3 ml-1 mr-4">
        <Input
          placeholder="输入任务名称"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <Button onClick={addTask}>
          <LuPlus className="mr-2" /> 添加
        </Button>
        <Button
          variant="destructive"
          onClick={clearAllTasks}
          disabled={tasks.length === 0}
        >
          <LuTrash2 className="mr-2" /> 清空
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 ml-1 mr-4 pb-3">
        <div 
          ref={listAnimateParent}
          className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {tasks.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground py-12">
              <LuClock className="w-12 h-12 mb-4" />
              <p>还没有计时任务</p>
              <p>点击上方"添加任务"按钮开始使用</p>
            </div>
          ) : (
            tasks.map(task => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <div 
                      ref={taskNameParent}
                      className="h-8 font-medium relative group flex items-center"
                    >
                      {task.isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            className="w-40 h-8"
                            defaultValue={task.name}
                            autoFocus
                            onBlur={(e) => updateTaskName(task.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateTaskName(task.id, (e.target as HTMLInputElement).value);
                              }
                            }}
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              const input = e.currentTarget.previousSibling as HTMLInputElement;
                              updateTaskName(task.id, input.value);
                            }}
                          >
                            <LuCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span 
                          className="cursor-text hover:cursor-text" 
                          onClick={() => startEditing(task.id)}
                        >
                          {task.name}
                        </span>
                      )}
                    </div>
                    <div className="text-4xl font-mono">
                      {formatTime(task.time, task.showMilliseconds)}
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => toggleTimer(task.id)}>
                        {task.isRunning ? <LuPause /> : <LuPlay />}
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => resetTimer(task.id)}>
                        <LuRotateCcw />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => toggleMilliseconds(task.id)}>
                        {task.showMilliseconds ? <LuStopCircle /> : <LuClock />}
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => deleteTask(task.id)}>
                        <LuTrash2 />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
