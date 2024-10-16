import type Database from "@tauri-apps/plugin-sql";

export type ScoreTopic = {
  id: number;
  name: string;
  class_id: number;
  subject_id: number;
};

// 插入积分主题记录
export const insertScoreTopic = async (
  db: Database,
  scoreTopic: Omit<ScoreTopic, "id">,
) => {
  const res = await db.execute(
    "INSERT INTO score_topic (name, class_id, subject_id) VALUES (?, ?, ?)",
    [scoreTopic.name, scoreTopic.class_id, scoreTopic.subject_id],
  );
  return res;
};

// 删除积分主题记录
export const deleteScoreTopic = async (db: Database, id: ScoreTopic["id"]) => {
  const res = await db.execute("DELETE FROM score_topic WHERE id = ?", [id]);
  return res;
};

// 更新积分主题记录
export const updateScoreTopic = async (db: Database, scoreTopic: ScoreTopic) => {
  const res = await db.execute(
    "UPDATE score_topic SET name = ?, class_id = ?, subject_id = ? WHERE id = ?",
    [
      scoreTopic.name,
      scoreTopic.class_id,
      scoreTopic.subject_id,
      scoreTopic.id,
    ],
  );
  return res;
};

// 查询积分主题记录
export const getScoreTopic = async (db: Database, id: ScoreTopic["id"]) => {
  const res = await db.execute("SELECT * FROM score_topic WHERE id = ?", [id]);
  return res;
};
