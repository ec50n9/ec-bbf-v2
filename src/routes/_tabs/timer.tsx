import Header from "@/components/share/header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuPlay, LuPause, LuRotateCcw, LuPlus, LuTrash2, LuClock, LuStopCircle, LuCheck } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { getAllTimerTasks, insertTimerTask, updateTimerTask, deleteTimerTask, clearAllTimerTasks } from "@/services/timer";
import { throttle } from "radash";

interface TimerTask {
  id: number;
  name: string;
  time: number;
  isRunning: boolean;
  showMilliseconds: boolean;
  isEditing?: boolean;
}

// 使用 radash 的 throttle
const throttledUpdateDB = throttle({ interval: 1000 }, async (task: TimerTask) => {
  try {
    await updateTimerTask(task);
  } catch (error) {
    console.error("更新计时器任务失败:", error);
  }
});

const MAX_TIMERS = 9; // 最大允许9个计时器

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

  // 初始加载任务
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await getAllTimerTasks();
        setTasks(savedTasks.map(task => ({
          ...task,
          isRunning: false,
          isEditing: false
        })));
      } catch (error) {
        console.error("加载计时器任务失败:", error);
      }
    };
    loadTasks();
  }, []);

  const addTask = async () => {
    if (tasks.length >= MAX_TIMERS) {
      // 可以添加一个提示UI
      console.warn("已达到最大计时器数量限制");
      return;
    }
    
    const taskName = newTaskName.trim() || getDefaultTaskName();
    const newTask: Omit<TimerTask, "id"> = {
      name: taskName,
      time: 0,
      showMilliseconds: false,
      isRunning: false
    };

    try {
      const result = await insertTimerTask(newTask);
      const taskWithId: TimerTask = {
        ...newTask,
        id: result.lastInsertId,
        isRunning: false
      };
      setTasks([...tasks, taskWithId]);
      setNewTaskName("");
    } catch (error) {
      console.error("添加计时器任务失败:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await deleteTimerTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("删除计时器任务失败:", error);
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

  const resetTimer = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, time: 0, isRunning: false } : task
    ));
  };

  const clearAllTasks = async () => {
    try {
      await clearAllTimerTasks();
      setTasks([]);
    } catch (error) {
      console.error("清空计时器任务失败:", error);
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

  // 更新任务时间
  useEffect(() => {
    const intervals: number[] = [];

    tasks.forEach(task => {
      if (task.isRunning) {
        const interval = window.setInterval(() => {
          const increment = task.showMilliseconds ? 0.01 : 1;
          setTasks(prev => prev.map(t => {
            if (t.id === task.id) {
              const updatedTask = { ...t, time: t.time + increment };
              throttledUpdateDB(updatedTask);
              return updatedTask;
            }
            return t;
          }));
        }, task.showMilliseconds ? 10 : 1000);
        intervals.push(interval);
      }
    });
    
    // 组件卸载时清理所有计时器
    return () => {
      intervals.forEach(clearInterval);
      // 同时将所有运行中的计时器状态保存到数据库
      tasks.forEach(task => {
        if (task.isRunning) {
          updateTimerTask(task).catch(console.error);
        }
      });
    };
  }, [tasks]);

  const startEditing = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  const updateTaskName = async (id: number, newName: string) => {
    try {
      const finalName = newName.trim() || getDefaultTaskName();
      // 先更新本地状态
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, name: finalName, isEditing: false } : task
      ));

      // 更新数据库
      const taskToUpdate = tasks.find(task => task.id === id);
      if (taskToUpdate) {
        await updateTimerTask({
          ...taskToUpdate,
          name: finalName
        });
      }
    } catch (error) {
      console.error("更新计时器任务名称失败:", error);
    }
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
