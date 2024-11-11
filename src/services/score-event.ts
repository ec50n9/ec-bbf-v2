import { getDatabase } from "./database";

export class ScoreEvent {
  constructor(
    public id: number,
    public name: string,
    public topic_id: number,
  ) {}

  static fromJSON(data: {
    id: number;
    name: string;
    topic_id: number;
  }) {
    return new ScoreEvent(data.id, data.name, data.topic_id);
  }
}

// 插入积分事件记录
export const insertScoreEvent = async (scoreEvent: Omit<ScoreEvent, "id">) => {
  const db = await getDatabase();
  const res = await db.execute(
    "INSERT INTO score_event (name, topic_id) VALUES (?, ?)",
    [scoreEvent.name, scoreEvent.topic_id],
  );
  return res;
};

// 删除积分事件记录
export const deleteScoreEvent = async (id: ScoreEvent["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("DELETE FROM score_event WHERE id = ?", [id]);
  return res;
};

// 更新积分事件记录
export const updateScoreEvent = async (scoreEvent: ScoreEvent) => {
  const db = await getDatabase();
  const res = await db.execute(
    "UPDATE score_event SET name = ?, topic_id = ? WHERE id = ?",
    [scoreEvent.name, scoreEvent.topic_id, scoreEvent.id],
  );
  return res;
};

// 查询积分事件记录
export const getScoreEvent = async (id: ScoreEvent["id"]) => {
  const db = await getDatabase();
  const res = await db.select<ScoreEvent[]>("SELECT * FROM score_event WHERE id = ?", [id]);
  return res.map(v => ScoreEvent.fromJSON(v));
};

// 新增：获取全部积分事件记录
export const getAllScoreEvents = async () => {
  const db = await getDatabase();
  const res = await db.select<ScoreEvent[]>("SELECT * FROM score_event");
  return res.map(v => ScoreEvent.fromJSON(v));
};
