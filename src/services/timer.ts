import { getDatabase } from "./database";

export interface TimerTask {
  id: number;
  name: string;
  time: number;
  showMilliseconds: boolean;
}

// 获取所有计时器任务
export const getAllTimerTasks = async (): Promise<TimerTask[]> => {
  const db = await getDatabase();
  const tasks = await db.select<Array<{
    id: number;
    name: string;
    time: number;
    show_milliseconds: number;
  }>>("SELECT * FROM timer_task");
  
  return tasks.map(task => ({
    id: task.id,
    name: task.name,
    time: task.time,
    showMilliseconds: Boolean(task.show_milliseconds)
  }));
};

// 添加计时器任务
export const insertTimerTask = async (task: Omit<TimerTask, "id">) => {
  const db = await getDatabase();
  const result = await db.execute(
    "INSERT INTO timer_task (name, time, show_milliseconds) VALUES (?, ?, ?)",
    [task.name, task.time, Number(task.showMilliseconds)]
  );
  return result;
};

// 更新计时器任务
export const updateTimerTask = async (task: TimerTask) => {
  const db = await getDatabase();
  await db.execute(
    "UPDATE timer_task SET name = ?, time = ?, show_milliseconds = ? WHERE id = ?",
    [task.name, task.time, Number(task.showMilliseconds), task.id]
  );
};

// 删除计时器任务
export const deleteTimerTask = async (id: number) => {
  const db = await getDatabase();
  await db.execute("DELETE FROM timer_task WHERE id = ?", [id]);
};

// 清空所有计时器任务
export const clearAllTimerTasks = async () => {
  const db = await getDatabase();
  await db.execute("DELETE FROM timer_task");
}; 