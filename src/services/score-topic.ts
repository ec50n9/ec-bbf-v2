import { getDatabase } from "./database";

export class ScoreTopic {
  constructor(
    public id: number,
    public name: string,
    public class_id: number,
    public subject_id: number,
  ) {}

  static fromJSON(data: {
    id: number;
    name: string;
    class_id: number;
    subject_id: number;
  }) {
    return new ScoreTopic(data.id, data.name, data.class_id, data.subject_id);
  }
}

// 插入积分主题记录
export const insertScoreTopic = async (scoreTopic: Omit<ScoreTopic, "id">) => {
  const db = await getDatabase();
  const res = await db.execute(
    "INSERT INTO score_topic (name, class_id, subject_id) VALUES (?, ?, ?)",
    [scoreTopic.name, scoreTopic.class_id, scoreTopic.subject_id],
  );
  return res;
};

// 删除积分主题记录
export const deleteScoreTopic = async (id: ScoreTopic["id"]) => {
  const db = await getDatabase();
  const res = await db.execute("DELETE FROM score_topic WHERE id = ?", [id]);
  return res;
};

// 更新积分主题记录
export const updateScoreTopic = async (scoreTopic: ScoreTopic) => {
  const db = await getDatabase();
  const res = await db.execute(
    "UPDATE score_topic SET name = ?, class_id = ?, subject_id = ? WHERE id = ?",
    [scoreTopic.name, scoreTopic.class_id, scoreTopic.subject_id, scoreTopic.id],
  );
  return res;
};

// 查询积分主题记录
export const getScoreTopic = async (id: ScoreTopic["id"]) => {
  const db = await getDatabase();
  const res = await db.select<ScoreTopic[]>("SELECT * FROM score_topic WHERE id = ?", [id]);
  return res;
};

// 获取全部积分主题记录
export const getAllScoreTopics = async () => {
  const db = await getDatabase();
  const res = await db.select<ScoreTopic[]>("SELECT * FROM score_topic");
  return res.map((v) => ScoreTopic.fromJSON(v));
};
