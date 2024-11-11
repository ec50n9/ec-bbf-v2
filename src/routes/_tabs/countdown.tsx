import Header from "@/components/share/header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuPlay, LuPause, LuRotateCcw, LuPlus, LuTrash2, LuClock, LuStopCircle, LuCheck } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { getAllCountdownTasks, insertCountdownTask, updateCountdownTask, deleteCountdownTask, clearAllCountdownTasks } from "@/services/countdown";
import { throttle } from "radash";

interface CountdownTask {
  id: number;
  name: string;
  initialTime: number;  // 初始设定的时间（秒）
  remainingTime: number;  // 剩余时间（秒）
  isRunning: boolean;
  showMilliseconds: boolean;
  isEditing?: boolean;
}

// 使用 throttle 限制数据库更新频率
const throttledUpdateDB = throttle({ interval: 1000 }, async (task: CountdownTask) => {
  try {
    await updateCountdownTask(task);
  } catch (error) {
    console.error("更新倒计时任务失败:", error);
  }
});

export default function Countdown() {
  const [tasks, setTasks] = useState<CountdownTask[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskMinutes, setNewTaskMinutes] = useState("");
  const [listAnimateParent] = useAutoAnimate();
  const [taskNameParent] = useAutoAnimate();

  const getDefaultTaskName = () => {
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const existingDefaultTasks = tasks.filter(task =>
      task.name.match(/^倒计时（[一二三四五六七八九十]）$/)
    ).length;
    return `倒计时（${chineseNumbers[existingDefaultTasks]}）`;
  };

  // 初始加载任务
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await getAllCountdownTasks();
        setTasks(savedTasks.map(task => ({
          ...task,
          isRunning: false,
          isEditing: false
        })));
      } catch (error) {
        console.error("加载倒计时任务失败:", error);
      }
    };
    loadTasks();
  }, []);

  const addTask = async () => {
    const minutes = parseInt(newTaskMinutes) || 0;
    const totalSeconds = minutes * 60;
    
    if (totalSeconds <= 0) return;

    const taskName = newTaskName.trim() || getDefaultTaskName();
    const newTask: Omit<CountdownTask, "id"> = {
      name: taskName,
      initialTime: totalSeconds,
      remainingTime: totalSeconds,
      showMilliseconds: false,
      isRunning: false
    };

    try {
      const result = await insertCountdownTask(newTask);
      const taskWithId: CountdownTask = {
        ...newTask,
        id: result.lastInsertId,
        isRunning: false
      };
      setTasks([...tasks, taskWithId]);
      setNewTaskName("");
      setNewTaskMinutes("");
    } catch (error) {
      console.error("添加倒计时任务失败:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await deleteCountdownTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("删除倒计时任务失败:", error);
    }
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

  const resetTimer = async (id: number) => {
    try {
      // 找到要重置的任务
      const taskToReset = tasks.find(task => task.id === id);
      if (!taskToReset) return;

      // 创建更新后的任务对象
      const updatedTask = {
        ...taskToReset,
        remainingTime: taskToReset.initialTime,
        isRunning: false
      };

      // 更新本地状态
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));

      // 更新数据库
      await updateCountdownTask(updatedTask);
    } catch (error) {
      console.error("重置倒计时任务失败:", error);
    }
  };

  const clearAllTasks = async () => {
    try {
      await clearAllCountdownTasks();
      setTasks([]);
    } catch (error) {
      console.error("清空倒计时任务失败:", error);
    }
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
      if (task.isRunning && task.remainingTime > 0) {
        const interval = window.setInterval(() => {
          setTasks(prev => prev.map(t => {
            if (t.id === task.id) {
              const newTime = t.remainingTime - (t.showMilliseconds ? 0.01 : 1);
              if (newTime <= 0) {
                const updatedTask = { ...t, remainingTime: 0, isRunning: false };
                throttledUpdateDB(updatedTask);
                return updatedTask;
              }
              const updatedTask = { ...t, remainingTime: newTime };
              throttledUpdateDB(updatedTask);
              return updatedTask;
            }
            return t;
          }));
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
      <Header title="倒计时" />
      <div className="flex gap-2 mt-3 ml-1 mr-4">
        <Input
          placeholder="任务名称"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <Input
          placeholder="分钟"
          value={newTaskMinutes}
          onChange={(e) => setNewTaskMinutes(e.target.value)}
          type="number"
          min="0"
          className="w-24"
        />
        <Button 
          onClick={addTask}
          disabled={!newTaskMinutes || parseInt(newTaskMinutes) <= 0}
        >
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
              <p>还没有倒计时任务</p>
              <p>点击上方"添加"按钮开始使用</p>
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
                      {formatTime(task.remainingTime, task.showMilliseconds)}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => toggleTimer(task.id)}
                        disabled={task.remainingTime <= 0}
                      >
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
