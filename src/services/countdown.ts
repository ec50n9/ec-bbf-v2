import { getDatabase } from "./database";

export interface CountdownTask {
  id: number;
  name: string;
  initialTime: number;
  remainingTime: number;
  showMilliseconds: boolean;
}

// 获取所有倒计时任务
export const getAllCountdownTasks = async (): Promise<CountdownTask[]> => {
  const db = await getDatabase();
  const tasks = await db.select<Array<{
    id: number;
    name: string;
    initial_time: number;
    remaining_time: number;
    show_milliseconds: number;
  }>>("SELECT * FROM countdown_task");
  
  return tasks.map(task => ({
    id: task.id,
    name: task.name,
    initialTime: task.initial_time,
    remainingTime: task.remaining_time,
    showMilliseconds: Boolean(task.show_milliseconds)
  }));
};

// 添加倒计时任务
export const insertCountdownTask = async (task: Omit<CountdownTask, "id">) => {
  const db = await getDatabase();
  const result = await db.execute(
    "INSERT INTO countdown_task (name, initial_time, remaining_time, show_milliseconds) VALUES (?, ?, ?, ?)",
    [task.name, task.initialTime, task.remainingTime, Number(task.showMilliseconds)]
  );
  return result;
};

// 更新倒计时任务
export const updateCountdownTask = async (task: CountdownTask) => {
  const db = await getDatabase();
  await db.execute(
    "UPDATE countdown_task SET name = ?, initial_time = ?, remaining_time = ?, show_milliseconds = ? WHERE id = ?",
    [task.name, task.initialTime, task.remainingTime, Number(task.showMilliseconds), task.id]
  );
};

// 删除倒计时任务
export const deleteCountdownTask = async (id: number) => {
  const db = await getDatabase();
  await db.execute("DELETE FROM countdown_task WHERE id = ?", [id]);
};

// 清空所有倒计时任务
export const clearAllCountdownTasks = async () => {
  const db = await getDatabase();
  await db.execute("DELETE FROM countdown_task");
}; 