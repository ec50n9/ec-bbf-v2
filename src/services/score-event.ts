import type Database from "@tauri-apps/plugin-sql";

export type ScoreEvent = {
  id: number;
  name: string;
  topic_id: number;
};

// 插入积分事件记录
export const insertScoreEvent = async (
  db: Database,
  scoreEvent: Omit<ScoreEvent, "id">,
) => {
  const res = await db.execute(
    "INSERT INTO score_event (topic_id) VALUES (?)",
    [scoreEvent.topic_id],
  );
  return res;
};

// 删除积分事件记录
export const deleteScoreEvent = async (db: Database, id: ScoreEvent["id"]) => {
  const res = await db.execute("DELETE FROM score_event WHERE id = ?", [id]);
  return res;
};

// 更新积分事件记录
export const updateScoreEvent = async (db: Database, scoreEvent: ScoreEvent) => {
  const res = await db.execute(
    "UPDATE score_event SET topic_id = ? WHERE id = ?",
    [
      scoreEvent.topic_id,
      scoreEvent.id,
    ],
  );
  return res;
};

// 查询积分事件记录
export const getScoreEvent = async (db: Database, id: ScoreEvent["id"]) => {
  const res = await db.execute("SELECT * FROM score_event WHERE id = ?", [id]);
  return res;
};
