/* 配置表 */
CREATE TABLE IF NOT EXISTS "config" (
 "id" INTEGER NOT NULL UNIQUE,
 -- 配置名称
 "name" VARCHAR,
 -- 配置值
 "value" VARCHAR,

 PRIMARY KEY("id")
);

/* 学生表 */
CREATE TABLE IF NOT EXISTS "student" (
	"id" INTEGER NOT NULL UNIQUE,
	-- 姓名
	"name" VARCHAR,
	-- 学号
	"stu_no" VARCHAR,
	-- 班级 id
	"class_id" INTEGER,
	-- 科目 id
	"subject_id" INTEGER,

	PRIMARY KEY("id"),
	FOREIGN KEY ("class_id") REFERENCES "class"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("subject_id") REFERENCES "subject"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

/* 学生分组表 */
CREATE TABLE IF NOT EXISTS "student_group" (
	"id" INTEGER NOT NULL UNIQUE,
	-- 分组名称
	"name" VARCHAR,
	-- 科目 id
	"subject_id" INTEGER,

	PRIMARY KEY("id"),
	FOREIGN KEY ("subject_id") REFERENCES "subject"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

/* 班级表 */
CREATE TABLE IF NOT EXISTS "class" (
	"id" INTEGER NOT NULL UNIQUE,
	-- 班级名称
	"name" VARCHAR,
	-- 年级
	"grade" VARCHAR,
	-- 班别
	"class" VARCHAR,

	PRIMARY KEY("id")
);

/* 学生分组关系表 */
CREATE TABLE IF NOT EXISTS "student_group_mapping" (
	"id" INTEGER NOT NULL UNIQUE,
	-- 分组 id
	"group_id" INTEGER,
	-- 学生 id
	"student_id" INTEGER,

	PRIMARY KEY("id"),
	FOREIGN KEY ("group_id") REFERENCES "student_group"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("student_id") REFERENCES "student"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

/* 科目表 */
CREATE TABLE IF NOT EXISTS "subject" (
	"id" INTEGER NOT NULL UNIQUE,
	-- 科目名称
	"name" VARCHAR,
	-- 班级 id
	"class_id" INTEGER,

	PRIMARY KEY("id"),
	FOREIGN KEY ("class_id") REFERENCES "class"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

/* 积分主题 */
CREATE TABLE IF NOT EXISTS "score_topic" (
	"id" INTEGER NOT NULL UNIQUE,
	-- 主题名称
	"name" VARCHAR,
	-- 班级 id
	"class_id" INTEGER,
	-- 科目 id
	"subject_id" INTEGER,

	PRIMARY KEY("id"),
	FOREIGN KEY ("class_id") REFERENCES "class"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("subject_id") REFERENCES "subject"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "score_event" (
	"id" INTEGER NOT NULL UNIQUE,
	"topic_id" INTEGER,

	PRIMARY KEY("id"),
	FOREIGN KEY ("topic_id") REFERENCES "score_topic"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "student_score_mapping" (
	"id" INTEGER NOT NULL UNIQUE,
	"student_id" INTEGER,
	"topic_id" INTEGER,
	"event_id" INTEGER,

	PRIMARY KEY("id"),
	FOREIGN KEY ("student_id") REFERENCES "student"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("topic_id") REFERENCES "score_topic"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("event_id") REFERENCES "score_event"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);